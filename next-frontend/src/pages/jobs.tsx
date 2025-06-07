"use client";
import JobLayout from "@/layouts/JobLayout";
import JobsSidebar from "@/components/JobsSidebar";
import JobsHeader from "@/components/JobsHeader";
import Footer from "@/components/Footer";
import JobSection from "@/components/JobSection";
import FriendRequestCard from "@/components/Friend-request-card";
import { Provider } from "react-redux";
import store from "@/store";

const jobs = () => {
  return (
    <Provider store={store}>
      <JobLayout>
        <JobsSidebar /> {/* Assuming JobsSidebar is a component */}
        <div className="jobs-container flex flex-col divide-y-2">
          <JobsHeader />
          <JobSection />
          {/* <FriendRequestCard name={""} username={""} avatarUrl={""}        /> */}
          <Footer />
        </div>
      </JobLayout>
    </Provider>
  );
};

export default jobs;
