const cron = require('node-cron');
const { Student, Attendance, LeaveForm,  AbsentNotification} = require('../models');

class AttendanceAutomation {
    constructor() {
        this.morningTime = '00 00 * * *';  // 11:27 PM
        this.eveningTime = '50 9 * * *'; // 10:00 PM
        this.morningJob = null;
        this.eveningJob = null;
    }

    async createUnmarkedAttendance() {
        try {
            console.log('Creating unmarked attendance records...');
            const students = await Student.find({});
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (const student of students) {
                const existingAttendance = await Attendance.findOne({
                    student: student._id,
                    date: {
                        $gte: today,
                        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                    }
                });

                if (!existingAttendance) {
                    await new Attendance({
                        student: student._id,
                        status: 'unmarked'
                    }).save();
                }
            }
            console.log('Created unmarked attendance records for all students');
        } catch (error) {
            console.error('Error creating unmarked attendance:', error);
        }
    }

    async checkUnmarkedAttendance() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const unmarkedAttendance = await Attendance.find({
                date: {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                },
                status: { $in: ['unmarked', 'absent'] }
            }).populate('student', 'name student_id room_no');

            console.log('Checking students with unmarked/absent attendance...');
            
            for (const record of unmarkedAttendance) {
                const LeaveFormuest = await LeaveForm.findOne({
                    student: record.student._id,
                    status: 'approved',
                    leaving_date: { $lte: record.date },
                    return_date: { $gte: record.date }
                });

                if (!LeaveFormuest && record.status === 'absent') {
                    // Create notification for unauthorized absence
                    const notification = new AbsentNotification({
                        student: record.student._id,
                        message: `${record.student.name} (Room: ${record.student.room_no}) was absent without approved leave on ${today.toDateString()}`
                    });
                    await notification.save();
                    console.log(`Created absence notification for student: ${record.student.name}`);
                }
            }
        } catch (error) {
            console.error('Error checking unmarked attendance:', error);
        }
    }

    updateSchedule(morningTime, eveningTime) {
        if (this.morningJob) this.morningJob.stop();
        if (this.eveningJob) this.eveningJob.stop();

        this.morningJob = cron.schedule(morningTime, () => this.createUnmarkedAttendance());
        this.eveningJob = cron.schedule(eveningTime, () => this.checkUnmarkedAttendance());

        console.log(`Updated schedule: Morning: ${morningTime}, Evening: ${eveningTime}`);
    }

    start() {
        this.updateSchedule(this.morningTime, this.eveningTime);
    }
}

module.exports = new AttendanceAutomation();
