import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { getCollegeDataById } from "../firebase/firestore";
import MainCalendar from "../components/calendar/MainCalendar";
import Nav from "../components/Nav";
import AuthCheck from "../components/AuthCheck";
import College from "../models/College";

const newCollege = new College();
const Home = () => {
  const router = useRouter();
  const { collegeId } = router.query;
  const [college, setCollege] = useState<College>(newCollege);
  const collegeObject = useRef<Object>("Waiting...");
  //TODO finsh useRef to persist college foreach render

  const [value, onChange] = useState(new Date());

  useEffect(() => {
    async function fetchData() {
      // You can await here
      if (collegeId != undefined) {
        const response = await getCollegeDataById(collegeId.toString());
        if (response != undefined) {
          setCollege(response as College);
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
        <Nav />
        <div className="first-column text-xl font-bold font-josefin w-full flex flex-row justify-center">
          {college.name}
        </div>

        <MainCalendar />
      </div>
    </AuthCheck>
  );
};

export default Home;
