const cron = require('node-cron');
const { Student, Attendance } = require('../models');

class AttendanceAutomation {
    constructor() {
        this.morningTime = '00 00 * * *';  // 11:27 PM
        this.eveningTime = '00 10 * * *'; // 10:00 PM
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

            console.log('Students with unmarked/absent attendance:');
            unmarkedAttendance.forEach(async (record) => {
                //check if leave request is approved for the day
                const leaveRequest = await LeaveReq.findOne({student_id: record.student.student_id, status: 'approved', start_date: {$lte: record.date}, end_date: {$gte: record.date}});
                if(leaveRequest){
                    console.log(`${record.student.name} (${record.student.student_id}) - Room: ${record.student.room_no} - Status: ${record.status} - Leave Request: ${leaveRequest.status}`);
                }else{
                    console.log(`${record.student.name} (${record.student.student_id}) - Room: ${record.student.room_no} - Status: ${record.status}`);
                }
            });
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
