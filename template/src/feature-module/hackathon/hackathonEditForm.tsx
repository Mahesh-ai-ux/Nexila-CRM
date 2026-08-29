import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/page-header/pageHeader";
import { all_routes } from "../../routes/all_routes";

// =====================================================
// API
// =====================================================

const HACKATHON_API =
  "/api/hackathon";

// =====================================================
// EDITABLE FIELDS
// =====================================================

const EDITABLE_FIELDS = {
  registrationId: false,

  fullName: true,
  phone: true,
  email: true,

  collegeName: true,
  degree: true,
  department: true,
  collegeRollNo: true,
  yearOfStudy: true,
  district: true,

  teamName: true,

  hackathonTrack: true,
  primaryTechnicalSkill: true,

  projectTitle: true,
  projectDescription: true,
  projectAbstract: true,
  problemStatement: true,
  proposedSolution: true,
  techStack: true,
  architectureDiagram: true,
  expectedOutcome: true,

  demoLink: true,
  githubLink: true,
};

// =====================================================
// TYPES
// =====================================================

type TeamMember = {
  name: string;
  phone: string;
  collegeRollNo: string;
};

type HackathonStudent = {
  _id: string;
  registrationId: string;

  fullName: string;
  phone: string;
  email: string;

  collegeName: string;
  degree: string;
  department: string;
  collegeRollNo: string;
  yearOfStudy: string;
  district: string;

  teamName: string;
  teamMembers: TeamMember[];

  hackathonTrack: string;
  primaryTechnicalSkill: string;

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

  paymentStatus: string;
  amount: number;

  termsAccepted: boolean;

  status: string;
};

// =====================================================
// FORM TYPE
// =====================================================

type HackathonForm = {
  registrationId: string;

  fullName: string;
  phone: string;
  email: string;

  collegeName: string;
  degree: string;
  department: string;
  collegeRollNo: string;
  yearOfStudy: string;
  district: string;

  teamName: string;

  hackathonTrack: string;
  primaryTechnicalSkill: string;

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
};

// =====================================================
// DEFAULT FORM
// =====================================================

const initialForm: HackathonForm = {
  registrationId: "",

  fullName: "",
  phone: "",
  email: "",

  collegeName: "",
  degree: "",
  department: "",
  collegeRollNo: "",
  yearOfStudy: "",
  district: "",

  teamName: "",

  hackathonTrack: "",
  primaryTechnicalSkill: "",

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
};

// =====================================================
// HELPERS
// =====================================================

const normalizeId = (value: any): string => {
  if (!value) {
    return "";
  }

  if (typeof value === "object") {
    if (value.$oid) {
      return String(value.$oid);
    }

    if (value.toString) {
      return String(value.toString());
    }
  }

  return String(value);
};

// =====================================================
// URL NORMALIZER
// =====================================================

const normalizeUrl = (value: any): string => {
  if (!value) {
    return "";
  }

  let url = String(value).trim();

  if (!url) {
    return "";
  }

  /*
    Handles values like:

    [https://github.com/example](https://github.com/example)

    Converts to:

    https://github.com/example
  */

  const markdownMatch = url.match(
    /^\[.*?\]\((.*?)\)$/
  );

  if (markdownMatch) {
    url = markdownMatch[1];
  }

  return url.trim();
};

// =====================================================
// COMPONENT
// =====================================================

const HackathonEditForm = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  // =================================================
  // STATE
  // =================================================

  const [form, setForm] =
    useState<HackathonForm>(initialForm);

  const [student, setStudent] =
    useState<HackathonStudent | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =================================================
  // FETCH STUDENT
  // =================================================

  useEffect(() => {

    if (!id) {

      setError(
        "Hackathon student ID not found"
      );

      setLoading(false);

      return;
    }

    const fetchStudent = async () => {

      try {

        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `${HACKATHON_API}/${id}`,
          {
            method: "GET",

            headers: {
              Accept:
                "application/json",

              ...(token
                ? {
                  Authorization:
                    `Bearer ${token}`,
                }
                : {}),
            },
          }
        );

        if (!response.ok) {

          throw new Error(
            `API Error: ${response.status}`
          );
        }

        const data =
          await response.json();

        console.log(
          "HACKATHON EDIT API RESPONSE:",
          data
        );

        // =================================================
        // SUPPORT DIFFERENT API STRUCTURES
        // =================================================

        const studentData =
          data?.student ??
          data?.data ??
          data;

        if (
          !studentData ||
          !studentData._id
        ) {

          setError(
            "Hackathon student not found"
          );

          return;
        }

        // =================================================
        // TEAM MEMBERS
        // =================================================

        const rawTeamMembers =
          Array.isArray(
            studentData.teamMembers
          )
            ? studentData.teamMembers
            : [];

        const teamMembers: TeamMember[] =
          rawTeamMembers.map(
            (member: any) => ({
              name:
                member?.name ?? "",

              phone:
                member?.phone ?? "",

              collegeRollNo:
                member?.collegeRollNo ??
                "",
            })
          );

        // =================================================
        // NORMALIZED STUDENT
        // =================================================

        const mappedStudent: HackathonStudent =
        {
          _id: normalizeId(
            studentData._id
          ),

          registrationId:
            studentData.registrationId ??
            "",

          fullName:
            studentData.fullName ??
            "",

          phone:
            studentData.phone ??
            "",

          email:
            studentData.email ??
            "",

          collegeName:
            studentData.collegeName ??
            "",

          degree:
            studentData.degree ??
            "",

          department:
            studentData.department ??
            "",

          collegeRollNo:
            studentData.collegeRollNo ??
            "",

          yearOfStudy:
            studentData.yearOfStudy ??
            "",

          district:
            studentData.district ??
            "",

          teamName:
            studentData.teamName ??
            "",

          teamMembers,

          hackathonTrack:
            studentData.hackathonTrack ??
            "",

          primaryTechnicalSkill:
            studentData.primaryTechnicalSkill ??
            "",

          projectTitle:
            studentData.projectTitle ??
            "",

          projectDescription:
            studentData.projectDescription ??
            "",

          projectAbstract:
            studentData.projectAbstract ??
            "",

          problemStatement:
            studentData.problemStatement ??
            "",

          proposedSolution:
            studentData.proposedSolution ??
            "",

          techStack:
            studentData.techStack ??
            "",

          architectureDiagram:
            studentData.architectureDiagram ??
            "",

          expectedOutcome:
            studentData.expectedOutcome ??
            "",

          demoLink:
            normalizeUrl(
              studentData.demoLink
            ),

          githubLink:
            normalizeUrl(
              studentData.githubLink
            ),

          paymentStatus:
            studentData.paymentStatus ??
            "PENDING",

          amount:
            Number(
              studentData.amount ?? 0
            ),

          termsAccepted:
            Boolean(
              studentData.termsAccepted
            ),

          status:
            studentData.status ??
            "REGISTERED",
        };

        setStudent(mappedStudent);

        // =================================================
        // SET FORM
        // =================================================

        setForm({
          registrationId:
            mappedStudent.registrationId,

          fullName:
            mappedStudent.fullName,

          phone:
            mappedStudent.phone,

          email:
            mappedStudent.email,

          collegeName:
            mappedStudent.collegeName,

          degree:
            mappedStudent.degree,

          department:
            mappedStudent.department,

          collegeRollNo:
            mappedStudent.collegeRollNo,

          yearOfStudy:
            mappedStudent.yearOfStudy,

          district:
            mappedStudent.district,

          teamName:
            mappedStudent.teamName,

          hackathonTrack:
            mappedStudent.hackathonTrack,

          primaryTechnicalSkill:
            mappedStudent.primaryTechnicalSkill,

          projectTitle:
            mappedStudent.projectTitle,

          projectDescription:
            mappedStudent.projectDescription,

          projectAbstract:
            mappedStudent.projectAbstract,

          problemStatement:
            mappedStudent.problemStatement,

          proposedSolution:
            mappedStudent.proposedSolution,

          techStack:
            mappedStudent.techStack,

          architectureDiagram:
            mappedStudent.architectureDiagram,

          expectedOutcome:
            mappedStudent.expectedOutcome,

          demoLink:
            mappedStudent.demoLink,

          githubLink:
            mappedStudent.githubLink,
        });

      } catch (err) {

        console.error(
          "Hackathon edit fetch error:",
          err
        );

        setError(
          "Unable to load hackathon student details"
        );

      } finally {

        setLoading(false);
      }
    };

    fetchStudent();

  }, [id]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (
    e:
      React.ChangeEvent<
        HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
      >
  ) => {

    const {
      name,
      value,
    } = e.target;

    setForm(
      previous => ({
        ...previous,
        [name]: value,
      })
    );
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!id) {

      setError(
        "Hackathon student ID not found"
      );

      return;
    }

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("token");

      // =================================================
      // PUT DATA
      // =================================================

      const payload = {

        /*
          Registration ID is intentionally
          not editable.

          We still send the existing value
          to the backend.
        */

        registrationId:
          student?.registrationId ??
          form.registrationId,

        fullName:
          form.fullName,

        phone:
          form.phone,

        email:
          form.email,

        collegeName:
          form.collegeName,

        degree:
          form.degree,

        department:
          form.department,

        collegeRollNo:
          form.collegeRollNo,

        yearOfStudy:
          form.yearOfStudy,

        district:
          form.district,

        teamName:
          form.teamName,

        hackathonTrack:
          form.hackathonTrack,

        primaryTechnicalSkill:
          form.primaryTechnicalSkill,

        projectTitle:
          form.projectTitle,

        projectDescription:
          form.projectDescription,

        projectAbstract:
          form.projectAbstract,

        problemStatement:
          form.problemStatement,

        proposedSolution:
          form.proposedSolution,

        techStack:
          form.techStack,

        architectureDiagram:
          form.architectureDiagram,

        expectedOutcome:
          form.expectedOutcome,

        demoLink:
          form.demoLink,

        githubLink:
          form.githubLink,
      };

      console.log(
        "UPDATE PAYLOAD:",
        payload
      );

      const response = await fetch(
        `${HACKATHON_API}/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",

            ...(token
              ? {
                Authorization:
                  `Bearer ${token}`,
              }
              : {}),
          },

          body:
            JSON.stringify(
              payload
            ),
        }
      );

      const data =
        await response.json();

      console.log(
        "UPDATE RESPONSE:",
        data
      );

      if (!response.ok) {

        throw new Error(
          data?.message ||
          data?.error ||
          `Update failed: ${response.status}`
        );
      }

      setSuccess(
        "Hackathon student details updated successfully."
      );

      // =================================================
      // GO BACK TO DETAILS
      // =================================================

      setTimeout(() => {

        navigate(
          `/hackathon/details/${id}`
        );

      }, 1000);

    } catch (err: any) {

      console.error(
        "Hackathon update error:",
        err
      );

      setError(
        err?.message ||
        "Unable to update hackathon student"
      );

    } finally {

      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="page-wrapper">

        <div className="content">

          <div className="text-center py-5">

            <p className="mb-0">
              Loading hackathon student...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (!student) {

    return (
      <div className="page-wrapper">

        <div className="content">

          <div className="alert alert-danger">
            {error ||
              "Hackathon student not found"}
          </div>

          <Link
            to={
              all_routes.hackathonDetails
            }
            className="btn btn-primary"
          >
            ← Back to Hackathon Students
          </Link>

        </div>

      </div>
    );
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="page-wrapper">

      <div className="content pb-0">

        {/* =================================================
                    PAGE HEADER
            ================================================= */}

        <PageHeader
          title="Edit Hackathon Student"
          badgeCount={1}
          showModuleTile={false}
          showExport={false}
        />

        {/* =================================================
                    BACK
            ================================================= */}

        <div className="mb-3">

          <Link
            to={`/hackathon/details/${student._id}`}
            className="text-primary"
          >
            ← Back to Hackathon Student
          </Link>

        </div>

        {/* =================================================
                    ALERTS
            ================================================= */}

        {error && (

          <div className="alert alert-danger">
            {error}
          </div>

        )}

        {success && (

          <div className="alert alert-success">
            {success}
          </div>

        )}

        {/* =================================================
                    FORM
            ================================================= */}

        <form
          onSubmit={handleSubmit}
        >

          <div className="row">

            {/* =================================================
                            LEFT
                ================================================= */}

            <div className="col-xl-4">

              {/* =============================================
                                REGISTRATION
                  ============================================== */}

              <div className="card">

                <div className="card-body">

                  <h5 className="mb-3">
                    Registration
                  </h5>

                  <div className="mb-3">

                    <label className="form-label">
                      Registration ID
                    </label>

                    <input
                      type="text"
                      name="registrationId"
                      value={
                        form.registrationId
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      disabled={
                        !EDITABLE_FIELDS.registrationId
                      }
                    />

                  </div>

                </div>

              </div>

              {/* =============================================
                                STUDENT INFORMATION
                  ============================================== */}

              <div className="card">

                <div className="card-body">

                  <h5 className="mb-3">
                    Student Information
                  </h5>

                  {/* NAME */}

                  <div className="mb-3">

                    <label className="form-label">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={
                        form.fullName
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      required
                      disabled={
                        !EDITABLE_FIELDS.fullName
                      }
                    />

                  </div>

                  {/* PHONE */}

                  <div className="mb-3">

                    <label className="form-label">
                      Phone
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={
                        form.phone
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      required
                      disabled={
                        !EDITABLE_FIELDS.phone
                      }
                    />

                  </div>

                  {/* EMAIL */}

                  <div className="mb-3">

                    <label className="form-label">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={
                        form.email
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      required
                      disabled={
                        !EDITABLE_FIELDS.email
                      }
                    />

                  </div>

                  {/* COLLEGE */}

                  <div className="mb-3">

                    <label className="form-label">
                      College Name
                    </label>

                    <input
                      type="text"
                      name="collegeName"
                      value={
                        form.collegeName
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      disabled={
                        !EDITABLE_FIELDS.collegeName
                      }
                    />

                  </div>

                  {/* ROLL NUMBER */}

                  <div className="mb-3">

                    <label className="form-label">
                      College Roll No
                    </label>

                    <input
                      type="text"
                      name="collegeRollNo"
                      value={
                        form.collegeRollNo
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      disabled={
                        !EDITABLE_FIELDS.collegeRollNo
                      }
                    />

                  </div>

                  {/* DEGREE */}

                  <div className="mb-3">

                    <label className="form-label">
                      Degree
                    </label>

                    <input
                      type="text"
                      name="degree"
                      value={
                        form.degree
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      disabled={
                        !EDITABLE_FIELDS.degree
                      }
                    />

                  </div>

                  {/* DEPARTMENT */}

                  <div className="mb-3">

                    <label className="form-label">
                      Department
                    </label>

                    <input
                      type="text"
                      name="department"
                      value={
                        form.department
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      disabled={
                        !EDITABLE_FIELDS.department
                      }
                    />

                  </div>

                  {/* YEAR */}

                  <div className="mb-3">

                    <label className="form-label">
                      Year of Study
                    </label>

                    <input
                      type="text"
                      name="yearOfStudy"
                      value={
                        form.yearOfStudy
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      disabled={
                        !EDITABLE_FIELDS.yearOfStudy
                      }
                    />

                  </div>

                  {/* DISTRICT */}

                  <div className="mb-0">

                    <label className="form-label">
                      District
                    </label>

                    <input
                      type="text"
                      name="district"
                      value={
                        form.district
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      disabled={
                        !EDITABLE_FIELDS.district
                      }
                    />

                  </div>

                </div>

              </div>

              {/* =============================================
                                TEAM
                  ============================================== */}

              <div className="card">

                <div className="card-body">

                  <h5 className="mb-3">
                    Team Information
                  </h5>

                  <div>

                    <label className="form-label">
                      Team Name
                    </label>

                    <input
                      type="text"
                      name="teamName"
                      value={
                        form.teamName
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      disabled={
                        !EDITABLE_FIELDS.teamName
                      }
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                            RIGHT
                ================================================= */}

            <div className="col-xl-8">

              {/* =============================================
                                HACKATHON
                  ============================================== */}

              <div className="card">

                <div className="card-body">

                  <h5 className="mb-3">
                    Hackathon Information
                  </h5>

                  <div className="row">

                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        Hackathon Track
                      </label>

                      <input
                        type="text"
                        name="hackathonTrack"
                        value={
                          form.hackathonTrack
                        }
                        onChange={
                          handleChange
                        }
                        className="form-control"
                        disabled={
                          !EDITABLE_FIELDS.hackathonTrack
                        }
                      />

                    </div>

                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        Primary Technical Skill
                      </label>

                      <input
                        type="text"
                        name="primaryTechnicalSkill"
                        value={
                          form.primaryTechnicalSkill
                        }
                        onChange={
                          handleChange
                        }
                        className="form-control"
                        disabled={
                          !EDITABLE_FIELDS.primaryTechnicalSkill
                        }
                      />

                    </div>

                  </div>

                </div>

              </div>

              {/* =============================================
                                PROJECT
                  ============================================== */}

              <div className="card">

                <div className="card-body">

                  <h5 className="mb-4">
                    Project Information
                  </h5>

                  {/* TITLE */}

                  <div className="mb-3">

                    <label className="form-label">
                      Project Title
                    </label>

                    <input
                      type="text"
                      name="projectTitle"
                      value={
                        form.projectTitle
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      disabled={
                        !EDITABLE_FIELDS.projectTitle
                      }
                    />

                  </div>

                  {/* DESCRIPTION */}

                  <div className="mb-3">

                    <label className="form-label">
                      Project Description
                    </label>

                    <textarea
                      name="projectDescription"
                      value={
                        form.projectDescription
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      rows={4}
                      disabled={
                        !EDITABLE_FIELDS.projectDescription
                      }
                    />

                  </div>

                  {/* ABSTRACT */}

                  <div className="mb-3">

                    <label className="form-label">
                      Project Abstract
                    </label>

                    <textarea
                      name="projectAbstract"
                      value={
                        form.projectAbstract
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      rows={5}
                      disabled={
                        !EDITABLE_FIELDS.projectAbstract
                      }
                    />

                  </div>

                  {/* PROBLEM */}

                  <div className="mb-3">

                    <label className="form-label">
                      Problem Statement
                    </label>

                    <textarea
                      name="problemStatement"
                      value={
                        form.problemStatement
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      rows={5}
                      disabled={
                        !EDITABLE_FIELDS.problemStatement
                      }
                    />

                  </div>

                  {/* SOLUTION */}

                  <div className="mb-3">

                    <label className="form-label">
                      Proposed Solution
                    </label>

                    <textarea
                      name="proposedSolution"
                      value={
                        form.proposedSolution
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      rows={5}
                      disabled={
                        !EDITABLE_FIELDS.proposedSolution
                      }
                    />

                  </div>

                  {/* TECH STACK */}

                  <div className="mb-3">

                    <label className="form-label">
                      Technology Stack
                    </label>

                    <textarea
                      name="techStack"
                      value={
                        form.techStack
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      rows={4}
                      disabled={
                        !EDITABLE_FIELDS.techStack
                      }
                    />

                  </div>

                  {/* ARCHITECTURE */}

                  <div className="mb-3">

                    <label className="form-label">
                      Architecture Diagram
                    </label>

                    <textarea
                      name="architectureDiagram"
                      value={
                        form.architectureDiagram
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      rows={4}
                      placeholder="Enter architecture image URL or architecture information"
                      disabled={
                        !EDITABLE_FIELDS.architectureDiagram
                      }
                    />

                    {form.architectureDiagram && (

                      <small className="text-muted">
                        Current architecture information is shown above.
                      </small>

                    )}

                  </div>

                  {/* EXPECTED OUTCOME */}

                  <div className="mb-3">

                    <label className="form-label">
                      Expected Outcome
                    </label>

                    <textarea
                      name="expectedOutcome"
                      value={
                        form.expectedOutcome
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      rows={4}
                      disabled={
                        !EDITABLE_FIELDS.expectedOutcome
                      }
                    />

                  </div>

                </div>

              </div>

              {/* =============================================
                                LINKS
                  ============================================== */}

              <div className="card">

                <div className="card-body">

                  <h5 className="mb-3">
                    Project Links
                  </h5>

                  {/* DEMO */}

                  <div className="mb-3">

                    <label className="form-label">
                      Demo Link
                    </label>

                    <input
                      type="url"
                      name="demoLink"
                      value={
                        form.demoLink
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      placeholder="https://example.com"
                      disabled={
                        !EDITABLE_FIELDS.demoLink
                      }
                    />

                    {form.demoLink && (

                      <div className="mt-2">

                        <a
                          href={
                            form.demoLink
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="ti ti-external-link me-1" />
                          Open Demo
                        </a>

                      </div>

                    )}

                  </div>

                  {/* GITHUB */}

                  <div className="mb-0">

                    <label className="form-label">
                      GitHub Link
                    </label>

                    <input
                      type="url"
                      name="githubLink"
                      value={
                        form.githubLink
                      }
                      onChange={
                        handleChange
                      }
                      className="form-control"
                      placeholder="https://github.com/username/project"
                      disabled={
                        !EDITABLE_FIELDS.githubLink
                      }
                    />

                    {form.githubLink && (

                      <div className="mt-2">

                        <a
                          href={
                            form.githubLink
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-dark"
                        >
                          <i className="ti ti-brand-github me-1" />
                          Open GitHub
                        </a>

                      </div>

                    )}

                  </div>

                </div>

              </div>

              {/* =============================================
                            CURRENT PAYMENT / STATUS
                  ============================================== */}

              <div className="card">

                <div className="card-body">

                  <h5 className="mb-3">
                    Current Information
                  </h5>

                  <div className="row">

                    <div className="col-md-4 mb-3">

                      <small className="text-muted d-block">
                        Payment Status
                      </small>

                      <span
                        className={
                          student.paymentStatus ===
                            "PAID"
                            ? "badge bg-success"
                            : student.paymentStatus ===
                              "FAILED"
                              ? "badge bg-danger"
                              : "badge bg-warning"
                        }
                      >
                        {
                          student.paymentStatus
                        }
                      </span>

                    </div>

                    <div className="col-md-4 mb-3">

                      <small className="text-muted d-block">
                        Amount
                      </small>

                      <span className="fw-medium">
                        ₹
                        {
                          student.amount
                        }
                      </span>

                    </div>

                    <div className="col-md-4 mb-3">

                      <small className="text-muted d-block">
                        Current Status
                      </small>

                      <span
                        className={
                          student.status ===
                            "SHORTLISTED"
                            ? "badge bg-success"
                            : student.status ===
                              "REJECTED" ||
                              student.status ===
                              "CANCELLED"
                              ? "badge bg-danger"
                              : "badge bg-primary"
                        }
                      >
                        {
                          student.status
                        }
                      </span>

                    </div>

                  </div>

                  <div className="alert alert-info mb-0">

                    <i className="ti ti-info-circle me-1" />

                    Payment and registration status
                    are managed separately. Use the
                    <strong> Change Status </strong>
                    option from the details page.

                  </div>

                </div>

              </div>

              {/* =============================================
                                BUTTONS
                  ============================================== */}

              <div className="card">

                <div className="card-body">

                  <div className="d-flex justify-content-end gap-2">

                    <Link
                      to={`/hackathon/details/${student._id}`}
                      className="btn btn-light"
                    >
                      Cancel
                    </Link>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={
                        saving
                      }
                    >

                      {saving ? (

                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                          />

                          Updating...
                        </>

                      ) : (

                        <>
                          <i className="ti ti-check me-1" />

                          Update Student
                        </>

                      )}

                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
};

export default HackathonEditForm;