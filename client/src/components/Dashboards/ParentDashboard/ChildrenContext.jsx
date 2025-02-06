import { createContext, useContext, useState, useEffect } from 'react';

const ChildrenContext = createContext();

export function ChildrenProvider({ children }) {
  const [childrenList, setChildrenList] = useState([]);
  
  useEffect(() => {
    const parent = JSON.parse(localStorage.getItem("parent"));
    
    fetch("https://hostelhub-hack-backend.vercel.app/api/parent/get-children", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parentId: parent._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setChildrenList(data.children);
        }
      });
  }, []);

  return (
    <ChildrenContext.Provider value={{ childrenList }}>
      {children}
    </ChildrenContext.Provider>
  );
}

export function useChildren() {
  return useContext(ChildrenContext);
}
