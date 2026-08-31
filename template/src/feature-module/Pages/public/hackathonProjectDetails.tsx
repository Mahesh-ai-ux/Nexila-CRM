import React, {
    useEffect,
    useState,
} from "react";

import {
    getHackathonProject,
    requestHackathonProjectOtp,
    verifyHackathonProjectOtp,
    updateHackathonProject,
} from "../../../services/hackathonProjectService";


// =====================================================
// TYPES
// =====================================================

interface ProjectData {
    projectTitle: string;
    projectDescription: string;
    projectAbstract: string;
    problemStatement: string;
    proposedSolution: string;
    techStack: string;
    architectureDiagram: string;
    expectedOutcome: string;
    demoLink: string;
    githubLink: string;
    driveLink: string; //drive link
}


// =====================================================
// INITIAL PROJECT
// =====================================================

const initialProject: ProjectData = {
    projectTitle: "",
    projectDescription: "",
    projectAbstract: "",
    problemStatement: "",
    proposedSolution: "",
    techStack: "",
    architectureDiagram: "",
    expectedOutcome: "",
    demoLink: "",
    githubLink: "",
    driveLink: "", //drive link
};


// =====================================================
// COMPONENT
// =====================================================

const HackathonProjectDetails = () => {

    // =================================================
    // GET REGISTRATION ID FROM URL
    // =================================================

    const params = new URLSearchParams(
        window.location.search
    );

    const registrationId =
        params.get("registrationId");


    // =================================================
    // STATE
    // =================================================

    const [data, setData] =
        useState<any>(null);

    const [loading, setLoading] =
        useState(true);

    const [otpSent, setOtpSent] =
        useState(false);

    const [otp, setOtp] =
        useState("");

    const [accessToken, setAccessToken] =
        useState<string | null>(null);

    const [editing, setEditing] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [project, setProject] =
        useState<ProjectData>(
            initialProject
        );


    // =================================================
    // LOAD PROJECT
    // =================================================

    useEffect(() => {

        if (!registrationId) {

            setError(
                "Registration ID is missing."
            );

            setLoading(false);

            return;
        }

        loadProject();

    }, [registrationId]);


    // =================================================
    // LOAD PROJECT FUNCTION
    // =================================================

    const loadProject = async () => {

        if (!registrationId) {
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response =
                await getHackathonProject(
                    registrationId
                );

            console.log(
                "Project API response:",
                response
            );


            // -----------------------------------------
            // HANDLE POSSIBLE RESPONSE STRUCTURES
            // -----------------------------------------

            const student =
                response?.data || response;


            if (!student) {

                setError(
                    "Registration details not found."
                );

                return;
            }


            // -----------------------------------------
            // SET STUDENT DATA
            // -----------------------------------------

            setData(student);


            // -----------------------------------------
            // SET PROJECT DATA
            // -----------------------------------------

            setProject({

                projectTitle:
                    student.projectTitle || "",

                projectDescription:
                    student.projectDescription || "",

                projectAbstract:
                    student.projectAbstract || "",

                problemStatement:
                    student.problemStatement || "",

                proposedSolution:
                    student.proposedSolution || "",

                techStack:
                    student.techStack || "",

                architectureDiagram:
                    student.architectureDiagram || "",

                expectedOutcome:
                    student.expectedOutcome || "",

                demoLink:
                    student.demoLink || "",

                githubLink:
                    student.githubLink || "",

                driveLink:
                    student.driveLink || "", //drive link

            });

        } catch (error: any) {

            console.error(
                "Load project error:",
                error
            );


            if (
                error?.response?.status === 401
            ) {

                setError(
                    "This project details API requires authentication. Please make the GET project API public."
                );

            } else if (
                error?.response?.status === 404
            ) {

                setError(
                    "Registration not found."
                );

            } else {

                setError(
                    error?.response?.data?.message ||
                    "Unable to load registration details."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    // =================================================
    // SEND OTP
    // =================================================

    const sendOtp = async () => {

        if (!registrationId) {

            setError(
                "Registration ID is missing."
            );

            return;
        }

        try {

            setError("");
            setMessage("");

            await requestHackathonProjectOtp(
                registrationId
            );

            setOtpSent(true);

            setMessage(
                "OTP sent to the Team Lead email address."
            );

        } catch (error: any) {

            console.error(
                "Send OTP error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Unable to send OTP."
            );
        }
    };


    // =================================================
    // VERIFY OTP
    // =================================================

    const verifyOtp = async () => {

        if (!registrationId) {

            setError(
                "Registration ID is missing."
            );

            return;
        }


        if (!otp.trim()) {

            setError(
                "Please enter the OTP."
            );

            return;
        }


        try {

            setError("");
            setMessage("");

            const response =
                await verifyHackathonProjectOtp(
                    registrationId,
                    otp.trim()
                );


            console.log(
                "OTP verification response:",
                response
            );


            // -----------------------------------------
            // GET ACCESS TOKEN
            // -----------------------------------------

            const token =
                response?.accessToken ||
                response?.data?.accessToken;


            if (!token) {

                setError(
                    "OTP verified, but access token was not received."
                );

                return;
            }


            // -----------------------------------------
            // SAVE TOKEN
            // -----------------------------------------

            setAccessToken(token);


            // -----------------------------------------
            // ENABLE EDITING
            // -----------------------------------------

            setEditing(true);

            setOtp("");

            setOtpSent(false);

            setMessage(
                "OTP verified. You can now edit project details."
            );

        } catch (error: any) {

            console.error(
                "Verify OTP error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Invalid OTP."
            );
        }
    };


    // =================================================
    // HANDLE PROJECT FIELD CHANGE
    // =================================================

    const handleChange = (
        field: keyof ProjectData,
        value: string
    ) => {

        setProject(
            previous => ({
                ...previous,
                [field]: value,
            })
        );
    };


    // =================================================
    // SAVE PROJECT
    // =================================================

    const saveProject = async () => {

        if (!registrationId) {

            setError(
                "Registration ID is missing."
            );

            return;
        }
        if (!project.driveLink.trim()) {
            setError("Drive Link is required.");
            return;
        }
        if (!project.projectTitle.trim()) {
            setError("Project Title is required.");
            return;
        }


        if (!accessToken) {

            setError(
                "Project access is not verified."
            );

            return;
        }


        try {

            setSaving(true);

            setError("");

            setMessage("");


            const response =
                await updateHackathonProject(
                    registrationId,
                    accessToken,
                    project
                );


            console.log(
                "Update response:",
                response
            );


            const updatedProject =
                response?.data || response;


            // -----------------------------------------
            // UPDATE LOCAL PROJECT
            // -----------------------------------------

            setProject({

                projectTitle:
                    updatedProject.projectTitle || "",

                projectDescription:
                    updatedProject.projectDescription || "",

                projectAbstract:
                    updatedProject.projectAbstract || "",

                problemStatement:
                    updatedProject.problemStatement || "",

                proposedSolution:
                    updatedProject.proposedSolution || "",

                techStack:
                    updatedProject.techStack || "",

                architectureDiagram:
                    updatedProject.architectureDiagram || "",

                expectedOutcome:
                    updatedProject.expectedOutcome || "",

                demoLink:
                    updatedProject.demoLink || "",

                githubLink:
                    updatedProject.githubLink || "",

                driveLink:
                    updatedProject.driveLink || "",

            });


            // -----------------------------------------
            // LOCK AGAIN
            // -----------------------------------------

            setEditing(false);

            setAccessToken(null);

            setMessage(
                "Project details saved successfully."
            );

        } catch (error: any) {

            console.error(
                "Save project error:",
                error
            );


            if (
                error?.response?.status === 401
            ) {

                setAccessToken(null);

                setEditing(false);

                setError(
                    "Project access has expired. Please verify OTP again."
                );

            } else {

                setError(
                    error?.response?.data?.message ||
                    "Unable to save project details."
                );
            }

        } finally {

            setSaving(false);

        }
    };


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (

            <div className="container py-5">

                <div className="text-center">

                    <h3>
                        Loading project details...
                    </h3>

                </div>

            </div>

        );
    }


    // =================================================
    // ERROR / NOT FOUND
    // =================================================

    if (
        !registrationId ||
        !data
    ) {

        return (

            <div className="container py-5">

                <div className="alert alert-danger">

                    {error ||
                        "Registration not found."}

                </div>

            </div>

        );
    }


    // =================================================
    // MAIN UI
    // =================================================

    return (

        <div className="container py-5">

            <div className="card shadow-sm">


                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="card-header">
                    <div className="text-center mb-3">
                        <img
                            src="/nexilalogo1.jpeg"
                            alt="Nexila Logo"
                            className="enquiry-logo"
                            width={200}
                        />
                    </div>

                    <h3 className="mb-1">
                        Hackathon Project Details
                    </h3>


                    <small className="mt-5">

                        Registration ID:{" "}

                        <strong>
                            {data.registrationId ||
                                registrationId}
                        </strong>

                    </small>
                    <small className="d-block text-danger mt-2">
                        <strong>Important:</strong> Before submitting your project details,
                        kindly read the Project Submission Instructions email carefully and
                        follow all the instructions provided. Click the OTP verification
                        option and check the Team Lead's registered email address for the OTP
                        to access and edit the project details. Please note that this project
                        details submission/editing page is valid only until
                        <strong> October 3, 2026.</strong> Kindly ensure that all required
                        project details and supporting documents are submitted before the
                        deadline.
                    </small>
                    <small className="d-block text-danger mt-3">
                        <strong>Important:</strong> OTP access will be available only after
                        your payment has been successfully verified by the Nexila Hackathon Team.
                        Once you have completed the payment, please send a clear screenshot of
                        the successful payment to our WhatsApp number:
                        <strong> +91 9803061234</strong>.
                        After your payment has been verified and you receive confirmation from
                        our team, you will be able to request the OTP and access the project
                        details page to update your submission.
                    </small>

                </div>


                {/* =====================================
                    BODY
                ===================================== */}

                <div className="card-body">


                    {/* =================================
                        SUCCESS MESSAGE
                    ================================= */}

                    {message && (

                        <div className="alert alert-success">

                            {message}

                        </div>

                    )}


                    {/* =================================
                        ERROR MESSAGE
                    ================================= */}

                    {error && (

                        <div className="alert alert-danger">

                            {error}

                        </div>

                    )}


                    {/* =================================
                        TEAM DETAILS
                    ================================= */}

                    <h4 className="mb-3">
                        Team Details
                    </h4>


                    {/* TEAM NAME */}

                    <div className="mb-3">

                        <label className="form-label">
                            Team Name
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={
                                data.teamName || ""
                            }
                            disabled
                        />

                    </div>


                    {/* TEAM MEMBERS */}

                    {data.teamMembers?.map(
                        (
                            member: any,
                            index: number
                        ) => (

                            <div
                                className="border rounded p-3 mb-3"
                                key={index}
                            >

                                <h5>
                                    {index === 0
                                        ? "Team Member 1 (Team Lead)"
                                        : `Team Member ${index + 1}`}
                                </h5>


                                {/* NAME */}

                                <div className="mb-2">

                                    <label className="form-label">
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={
                                            member.name || ""
                                        }
                                        disabled
                                    />

                                </div>


                                {/* PHONE */}

                                <div className="mb-2">

                                    <label className="form-label">
                                        Phone Number
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={
                                            member.phone || ""
                                        }
                                        disabled
                                    />

                                </div>


                                {/* COLLEGE ROLL NUMBER */}

                                <div>

                                    <label className="form-label">
                                        College Roll No
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={
                                            member.collegeRollNo || ""
                                        }
                                        disabled
                                    />

                                </div>

                            </div>

                        )
                    )}


                    {/* =================================
                        PROJECT ACCESS
                    ================================= */}

                    {!editing && (

                        <div className="border rounded p-4 mt-4">

                            <h4>
                                Project Details
                            </h4>

                            <p className="text-muted">

                                Project details are locked.
                                Verify the OTP sent to the
                                Team Lead email address to
                                edit the project.

                            </p>


                            {/* SEND OTP */}

                            {!otpSent && (

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={sendOtp}
                                >

                                    Send OTP

                                </button>

                            )}


                            {/* OTP */}

                            {otpSent && (

                                <div>

                                    <label className="form-label mt-3">
                                        Enter OTP
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={otp}
                                        onChange={
                                            e =>
                                                setOtp(
                                                    e.target.value
                                                )
                                        }
                                        maxLength={6}
                                        placeholder="Enter 6 digit OTP"
                                    />


                                    <button
                                        type="button"
                                        className="btn btn-success mt-3"
                                        onClick={verifyOtp}
                                    >

                                        Verify OTP

                                    </button>

                                </div>

                            )}

                        </div>

                    )}


                    {/* =================================
                        PROJECT DETAILS
                    ================================= */}

                    <div className="mt-4">

                        <h4>
                            Project Details
                        </h4>


                        {/* PROJECT TITLE */}

                        <div className="mb-3">

                            <label className="form-label">
                                Project Title *
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                required={editing}
                                value={
                                    project.projectTitle
                                }
                                disabled={!editing}
                                onChange={
                                    e =>
                                        handleChange(
                                            "projectTitle",
                                            e.target.value
                                        )
                                }
                            />

                        </div>

                        {/* DRIVE LINK */}

                        <div className="mb-3">

                            <label className="form-label">
                                DRIVE Link *
                            </label>

                            <input
                                type="url"
                                className="form-control"
                                value={
                                    project.driveLink
                                }
                                disabled={!editing}
                                onChange={
                                    e =>
                                        handleChange(
                                            "driveLink",
                                            e.target.value
                                        )
                                }
                                placeholder="https://drive.google.com/drive/folders/.................?usp=sharing"

                                required={editing}
                            />

                        </div>
                        {/* PROJECT DESCRIPTION */}

                        <ProjectTextarea
                            label="Project Description / Outline"
                            value={
                                project.projectDescription
                            }
                            disabled={!editing}
                            onChange={
                                value =>
                                    handleChange(
                                        "projectDescription",
                                        value
                                    )
                            }
                        />


                        {/* ABSTRACT */}

                        <ProjectTextarea
                            label="Project Abstract"
                            value={
                                project.projectAbstract
                            }
                            disabled={!editing}
                            onChange={
                                value =>
                                    handleChange(
                                        "projectAbstract",
                                        value
                                    )
                            }
                        />


                        {/* PROBLEM STATEMENT */}

                        <ProjectTextarea
                            label="Problem Statement"
                            value={
                                project.problemStatement
                            }
                            disabled={!editing}
                            onChange={
                                value =>
                                    handleChange(
                                        "problemStatement",
                                        value
                                    )
                            }
                        />


                        {/* PROPOSED SOLUTION */}

                        <ProjectTextarea
                            label="Proposed Solution"
                            value={
                                project.proposedSolution
                            }
                            disabled={!editing}
                            onChange={
                                value =>
                                    handleChange(
                                        "proposedSolution",
                                        value
                                    )
                            }
                        />


                        {/* TECH STACK */}

                        <ProjectTextarea
                            label="Tech Stack"
                            value={
                                project.techStack
                            }
                            disabled={!editing}
                            onChange={
                                value =>
                                    handleChange(
                                        "techStack",
                                        value
                                    )
                            }
                        />


                        {/* ARCHITECTURE */}

                        <ProjectTextarea
                            label="Architecture Diagram"
                            value={
                                project.architectureDiagram
                            }
                            disabled={!editing}
                            onChange={
                                value =>
                                    handleChange(
                                        "architectureDiagram",
                                        value
                                    )
                            }
                        />


                        {/* EXPECTED OUTCOME */}

                        <ProjectTextarea
                            label="Expected Outcome"
                            value={
                                project.expectedOutcome
                            }
                            disabled={!editing}
                            onChange={
                                value =>
                                    handleChange(
                                        "expectedOutcome",
                                        value
                                    )
                            }
                        />


                        {/* DEMO LINK */}

                        <div className="mb-3">

                            <label className="form-label">
                                Demo Link
                            </label>

                            <input
                                type="url"
                                className="form-control"
                                value={
                                    project.demoLink
                                }
                                disabled={!editing}
                                onChange={
                                    e =>
                                        handleChange(
                                            "demoLink",
                                            e.target.value
                                        )
                                }
                                placeholder="https://..."
                            />

                        </div>


                        {/* GITHUB LINK */}

                        <div className="mb-3">

                            <label className="form-label">
                                GitHub Link
                            </label>

                            <input
                                type="url"
                                className="form-control"
                                value={
                                    project.githubLink
                                }
                                disabled={!editing}
                                onChange={
                                    e =>
                                        handleChange(
                                            "githubLink",
                                            e.target.value
                                        )
                                }
                                placeholder="https://github.com/..."
                            />

                        </div>




                        {/* SAVE */}

                        {editing && (

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={saveProject}
                                disabled={saving}
                            >

                                {saving
                                    ? "Saving..."
                                    : "Save Project Details"}

                            </button>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );
};


// =====================================================
// TEXTAREA COMPONENT
// =====================================================

interface ProjectTextareaProps {
    label: string;
    value: string;
    disabled: boolean;
    onChange: (value: string) => void;
}


const ProjectTextarea = ({
    label,
    value,
    disabled,
    onChange,
}: ProjectTextareaProps) => {

    return (

        <div className="mb-3">

            <label className="form-label">
                {label}
            </label>

            <textarea
                className="form-control"
                rows={4}
                value={value}
                disabled={disabled}
                onChange={
                    e =>
                        onChange(
                            e.target.value
                        )
                }
            />

        </div>

    );
};


export default HackathonProjectDetails;