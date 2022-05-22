import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { getCollegeDataById } from "../firebase/firestore";
import MainCalendar from "../components/calendar/MainCalendar";
import Nav from "../components/Nav";
import AuthCheck from "../components/AuthCheck";
import CollegeModel from "../models/College";

const newCollege = new CollegeModel();
const Home = () => {
  const router = useRouter();
  const { collegeId } = router.query;
  const [college, setCollege] = useState<CollegeModel>(newCollege);
  const collegeObject = useRef<Object>("Waiting...");
  //TODO finsh useRef to persist college foreach render
  //TODO any logged in user can access another college with the id

  const [value, onChange] = useState(new Date());

  useEffect(() => {
    async function fetchData() {
      // You can await here
      if (collegeId != undefined) {
        const response = await getCollegeDataById(collegeId.toString());
        if (response != undefined) {
          setCollege(response as CollegeModel);
        }
        return response;
      }
    }
    fetchData();
  }, [collegeId]);

  return (
    <AuthCheck className="h-screen ">
      <div className="h-full overflow-y-auto overflow-x-hidden">
        <title>{"Guardias - " + college.name}</title>
        <Nav  college={college}/>
        <div className="first-column text-xl font-bold font-josefin w-full flex flex-row justify-center">
          {college.name}
        </div>

        <MainCalendar/>
      </div>
    </AuthCheck>
  );
};

export default Home;
