import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../store";
import { setCurrentHome } from "../store/navigationMenu/navigation";
// import feedImage from "../../assets/rss.png";
// import galleryImage from "../../assets/gallery.png";
// import postsImage from "../../assets/blog.png";
// import membersImage from "../../assets/user.png";
// import aboutUsImage from "../../assets/info.png";
// import membershipFormImage from "../../assets/membershipForm.png"

const links = [
    {
        description: "View and Add Users",
        image: "https://ganasurakshaparty.in/assets/user.e7fe177a.png",
        imageAlt: "Users Admin",
        name: "Users Admin",
        redirectLink: "/admin/credentials",
    },
    {
        description: "View all Submissions",
        image: "https://ganasurakshaparty.in/assets/membershipForm.885bdc88.png",
        imageAlt: "Submissions",
        name: "Submissions",
        redirectLink: "/admin/submissions",
    },
    {
        description: "Manage Output references",
        image: "https://ganasurakshaparty.in/assets/membershipForm.885bdc88.png",
        imageAlt: "References",
        name: "References Manager",
        redirectLink: "/admin/references",
    },
    {
        description: "Manage Human Evaluation Tasks",
        image: "https://ganasurakshaparty.in/assets/membershipForm.885bdc88.png",
        imageAlt: "References",
        name: "Evaluation Tasks",
        redirectLink: "/admin/humanEvaluationTasksList",
    },
];

const AdminHome = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setCurrentHome());
    })
    return (
        <div className="grid justify-center ">
            <div className="m-10 grid grid-cols-1 justify-items-center gap-2 lg:gap-16 sm:grid-cols-2">
                {links.map((link, index) => {
                    const isLastItem = index === links.length - 1;

                    if (isLastItem && index % 2 === 0) {
                        return (
                            <></>
                        );
                    }
                    return (

                        <div className={`m-3 w-full rounded-lg border border-gray-200 bg-white p-3 shadow-md dark:border-gray-700 dark:bg-gray-800`}
                            key={index}>
                            <div className="flex flex-col items-center justify-center">
                                <button className="p-4">
                                    <img
                                        className="rounded-t-lg w-[200px]"
                                        src={link.image}
                                        alt={link.imageAlt}
                                    />
                                </button>
                            </div>
                            <div className="p-5">
                                <button>
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        {link.name}
                                    </h5>
                                </button>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                    {link.description}
                                </p>
                                <Link
                                    to={link.redirectLink}
                                    className="inline-flex items-center rounded-lg bg-blue-700 py-2 px-3   text-center text-xs text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:text-sm"
                                >
                                    Redirect
                                    <svg
                                        aria-hidden="true"
                                        className="ml-2 -mr-1 h-4 w-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
            {links.length % 2 === 1 ? <>

                <div className="m-10 grid grid-cols-1 justify-items-center gap-2 lg:gap-16">
                    <div className={`m-3 w-full rounded-lg border border-gray-200 bg-white p-3 shadow-md dark:border-gray-700 dark:bg-gray-800`}
                    >
                        <div className="flex flex-col items-center justify-center">
                            <button className="p-4">
                                <img
                                    className="rounded-t-lg w-[200px]"
                                    src={links[links.length - 1].image}
                                    alt={links[links.length - 1].imageAlt}
                                />
                            </button>
                        </div>
                        <div className="p-5">
                            <button>
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {links[links.length - 1].name}
                                </h5>
                            </button>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                {links[links.length - 1].description}
                            </p>
                            <Link
                                to={links[links.length - 1].redirectLink}
                                className="inline-flex items-center rounded-lg bg-blue-700 py-2 px-3   text-center text-xs text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:text-sm"
                            >
                                Redirect
                                <svg
                                    aria-hidden="true"
                                    className="ml-2 -mr-1 h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </> : null}
        </div>
    );
};

export default AdminHome;