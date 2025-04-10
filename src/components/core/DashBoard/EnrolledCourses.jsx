import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserCourses as getUserEnrolledCourses } from '../../../services/operations/profileAPi';
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate } from 'react-router-dom';

const EnrolledCourses = () => {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);

    const [enrolledCourses, setEnrolledCourses] = useState(undefined);
    const [progressData, setProgressData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getEnrolledCourses = async () => {
        setLoading(true);
        const response = await getUserEnrolledCourses(token, dispatch);
        console.log("getEnrolledCourses -> response", response?.courseProgress);
        setEnrolledCourses(response || []);
        setProgressData(response?.courseProgress || []);
        setLoading(false);
    };

    const totalNoOfLectures = (course) => {
        return course?.courseContent?.reduce(
            (total, section) => total + (section?.subSection?.length || 0),
            0
        ) || 0;
    };

    useEffect(() => {
        getEnrolledCourses();
    }, []);

    if (loading || !enrolledCourses) {
        return (
            <div className="flex h-[calc(100vh)] w-full justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-richblack-500"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
            <div className="text-3xl text-richblack-50">Enrolled Courses</div>

            {enrolledCourses.length === 0 ? (
                <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
                    You have not enrolled in any course yet
                </p>
            ) : (
                <div className="my-8 text-richblack-5">
                    <div className="flex rounded-t-lg bg-richblack-500">
                        <p className="w-[45%] px-5 py-3">Course Name</p>
                        <p className="w-1/4 px-2 py-3"></p>
                        <p className="flex-1 px-2 py-3">Progress</p>
                    </div>

                    {enrolledCourses.map((course) => {
                        const courseLectures = totalNoOfLectures(course);
                        const progress = progressData?.find((item) => item.courseID === course._id);
                        const completed = progress?.completedVideos?.length || 0;
                        const percentage = courseLectures > 0 ? (completed / courseLectures) * 100 : 0;

                        return (
                            <div
                                key={course._id}
                                onClick={() => {
                                    if (
                                        course?.courseContent?.length &&
                                        course.courseContent[0]?.subSection?.length
                                    ) {
                                        navigate(
                                            `/dashboard/enrolled-courses/view-course/${course._id}/section/${course.courseContent[0]._id}/sub-section/${course.courseContent[0].subSection[0]._id}`
                                        );
                                    }
                                }}
                                className="flex items-center border border-richblack-700 rounded-none cursor-pointer hover:bg-richblack-800 transition-all duration-200"
                            >
                                <div className="flex w-[45%] items-center gap-4 px-5 py-3">
                                    <img
                                        className="h-14 w-14 rounded-lg object-cover"
                                        src={course.thumbnail || "/default-thumbnail.jpg"}
                                        alt="Course Thumbnail"
                                    />
                                    <div className="flex max-w-xs flex-col gap-2">
                                        <p className="font-semibold">{course.courseName}</p>
                                        <p className="text-xs text-richblack-300 hidden md:block">
                                            {course.courseDescription
                                                ? course.courseDescription.length > 50
                                                    ? course.courseDescription.slice(0, 50) + '...'
                                                    : course.courseDescription
                                                : "No description available"}
                                        </p>
                                    </div>
                                </div>

                                <div className="w-1/4 px-2 py-3">{course?.totalDuration || "N/A"}</div>

                                <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                                    <p>
                                        Completed: {completed} / {courseLectures}
                                    </p>
                                    <ProgressBar
                                        completed={percentage}
                                        height="8px"
                                        isLabelVisible={false}
                                        bgColor="#ffd60a"
                                        baseBgColor="#2c2f38"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EnrolledCourses;


