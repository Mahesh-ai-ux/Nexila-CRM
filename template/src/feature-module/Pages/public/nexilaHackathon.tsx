import React, { useState } from "react";
declare global {
    interface Window {
        Razorpay: any;
    }
}
interface TeamMember {
    name: string;
    phone: string;
    collegeRollNo: string;
}

interface HackathonFormData {
    fullName: string;
    phone: string;
    email: string;
    collegeName: string;
    degree: string;
    department: string;
    collegeRollNo: string;
    city: string;
    projectTitle: string;
    projectDescription: string;
    projectAbstract: string;
    teamMembers: TeamMember[];
}

const NexilaHackathon: React.FC = () => {
    const [showSuccessModal, setShowSuccessModal] =
        useState(false);

    const [paymentLoading, setPaymentLoading] =
        useState(false);

    const getInitialFormData = (): HackathonFormData => ({
        fullName: "",
        phone: "",
        email: "",
        collegeName: "",
        degree: "",
        department: "",
        collegeRollNo: "",
        city: "",
        projectTitle: "",
        projectDescription: "",
        projectAbstract: "",

        teamMembers: [
            {
                name: "",
                phone: "",
                collegeRollNo: "",
            },
            {
                name: "",
                phone: "",
                collegeRollNo: "",
            },
        ],
    });
    const [formData, setFormData] =
        useState<HackathonFormData>(
            getInitialFormData()
        );

    // =====================================================
    // HANDLE MAIN FORM CHANGE
    // =====================================================

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {

        const { name, value } = e.target;

        setFormData((prev) => {

            const updatedData = {
                ...prev,
                [name]:
                    name === "fullName"
                        ? value.toUpperCase()
                        : value,
            };

            // Automatically update Team Member 1
            if (
                name === "fullName" ||
                name === "phone" ||
                name === "collegeRollNo"
            ) {

                updatedData.teamMembers = [
                    {
                        name:
                            name === "fullName"
                                ? value.toUpperCase()
                                : prev.fullName,

                        phone:
                            name === "phone"
                                ? value
                                : prev.phone,

                        collegeRollNo:
                            name === "collegeRollNo"
                                ? value
                                : prev.collegeRollNo,
                    },

                    ...prev.teamMembers.slice(1),
                ];
            }

            return updatedData;
        });
    };


    // =====================================================
    // HANDLE TEAM MEMBER CHANGE
    // =====================================================

    const handleTeamMemberChange = (
        index: number,
        field: keyof TeamMember,
        value: string
    ) => {

        // Team Member 1 cannot be edited
        if (index === 0) {
            return;
        }

        setFormData((prev) => {

            const updatedMembers = [
                ...prev.teamMembers,
            ];

            updatedMembers[index] = {
                ...updatedMembers[index],

                [field]:
                    field === "name"
                        ? value.toUpperCase()
                        : value,
            };

            return {
                ...prev,
                teamMembers: updatedMembers,
            };
        });
    };


    // =====================================================
    // ADD TEAM MEMBER
    // =====================================================

    const addTeamMember = () => {

        if (formData.teamMembers.length >= 4) {
            return;
        }

        setFormData((prev) => ({
            ...prev,

            teamMembers: [
                ...prev.teamMembers,

                {
                    name: "",
                    phone: "",
                    collegeRollNo: "",
                },
            ],
        }));
    };


    // =====================================================
    // REMOVE TEAM MEMBER
    // =====================================================

    const removeTeamMember = (index: number) => {

        // Team Member 1 and 2 should always exist
        if (index <= 1) {
            return;
        }

        setFormData((prev) => ({
            ...prev,

            teamMembers:
                prev.teamMembers.filter(
                    (_, i) => i !== index
                ),
        }));
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();


        // ============================================
        // TEAM VALIDATION
        // ============================================

        if (
            formData.teamMembers.length < 2
        ) {

            alert(
                "Minimum 2 team members are required"
            );

            return;
        }


        if (
            formData.teamMembers.length > 4
        ) {

            alert(
                "Maximum 4 team members are allowed"
            );

            return;
        }


        // ============================================
        // CHECK TEAM MEMBER DETAILS
        // ============================================

        for (
            let i = 0;
            i < formData.teamMembers.length;
            i++
        ) {

            const member =
                formData.teamMembers[i];


            if (
                !member.name ||
                !member.phone ||
                !member.collegeRollNo
            ) {

                alert(
                    `Please complete Team Member ${i + 1} details`
                );

                return;
            }


            if (
                member.phone.length !== 10
            ) {

                alert(
                    `Team Member ${i + 1} phone number must contain 10 digits`
                );

                return;
            }
        }


        try {

            setPaymentLoading(true);


            // ============================================
            // 1. CREATE RAZORPAY ORDER
            // ============================================

            const orderResponse =
                await fetch(
                    "http://3.16.128.134:5000/api/hackathon/public/create-order",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            teamMembers:
                                formData.teamMembers,
                        }),
                    }
                );


            const orderResult =
                await orderResponse.json();


            if (!orderResponse.ok) {

                throw new Error(
                    orderResult.message ||
                    "Unable to create payment order"
                );
            }


            // ============================================
            // 2. CALCULATE / GET AMOUNT
            // ============================================

            const amount =
                orderResult.amount;


            // ============================================
            // 3. RAZORPAY OPTIONS
            // ============================================

            const options = {

                key:
                    orderResult.keyId,

                amount:
                    orderResult.amountInPaise,

                currency:
                    orderResult.currency,

                name:
                    "Nexila Technologies",

                description:
                    `Hackathon Registration - ${formData.teamMembers.length} Members`,

                order_id:
                    orderResult.orderId,


                prefill: {

                    name:
                        formData.fullName,

                    email:
                        formData.email,

                    contact:
                        `+91${formData.phone}`,

                },


                notes: {

                    teamSize:
                        String(
                            formData.teamMembers.length
                        ),

                },


                theme: {

                    color:
                        "#0d6efd",

                },


                modal: {

                    confirm_close:
                        true,

                    escape:
                        false,

                    backdropclose:
                        false,

                },


                handler:
                    async function (
                        response: any
                    ) {

                        try {

                            // ========================================
                            // 4. VERIFY PAYMENT ON BACKEND
                            // ========================================

                            const verifyResponse =
                                await fetch(
                                    "http://3.16.128.134:5000/api/hackathon/public/verify-payment",
                                    {
                                        method: "POST",

                                        headers: {
                                            "Content-Type":
                                                "application/json",
                                        },

                                        body:
                                            JSON.stringify({

                                                formData,

                                                razorpay_order_id:
                                                    response.razorpay_order_id,

                                                razorpay_payment_id:
                                                    response.razorpay_payment_id,

                                                razorpay_signature:
                                                    response.razorpay_signature,

                                            }),
                                    }
                                );


                            const verifyResult =
                                await verifyResponse.json();


                            if (
                                !verifyResponse.ok
                            ) {

                                throw new Error(
                                    verifyResult.message ||
                                    "Payment verification failed"
                                );
                            }


                            // ========================================
                            // 5. PAYMENT + REGISTRATION SUCCESS
                            // ========================================

                            console.log(
                                "Registration Success:",
                                verifyResult
                            );


                            setPaymentLoading(
                                false
                            );


                            // Show custom modal
                            setShowSuccessModal(
                                true
                            );

                        } catch (
                        verificationError
                        ) {

                            console.error(
                                "Payment Verification Error:",
                                verificationError
                            );


                            setPaymentLoading(
                                false
                            );


                            alert(
                                verificationError instanceof Error
                                    ? verificationError.message
                                    : "Payment verification failed"
                            );
                        }
                    },


                // ========================================
                // PAYMENT FAILURE
                // ========================================

                retry: {

                    enabled: true,

                    max_count: 3,

                },

            };


            // ============================================
            // 6. OPEN RAZORPAY
            // ============================================

            if (!window.Razorpay) {

                throw new Error(
                    "Razorpay Checkout is not loaded"
                );
            }


            const razorpay =
                new window.Razorpay(
                    options
                );


            razorpay.on(
                "payment.failed",
                function (
                    response: any
                ) {

                    console.error(
                        "Payment Failed:",
                        response.error
                    );


                    setPaymentLoading(
                        false
                    );

                    alert(
                        response.error?.description ||
                        "Payment failed"
                    );
                }
            );


            razorpay.open();


        } catch (error) {

            console.error(
                "Registration Payment Error:",
                error
            );


            setPaymentLoading(
                false
            );


            alert(
                error instanceof Error
                    ? error.message
                    : "Unable to start payment"
            );
        }
    };


    return (

        <div className="page-wrapper">

            <div className="content">

                <div className="container-fluid">


                    {/* =====================================================
                        HEADER
                    ====================================================== */}

                    <div className="text-center mb-4">

                        <h1>
                            Nexila Hackathon
                        </h1>

                        <p className="text-muted">
                            Student Project Registration
                        </p>

                    </div>


                    <form onSubmit={handleSubmit}>


                        {/* =====================================================
                            STUDENT DETAILS
                        ====================================================== */}

                        <div className="card">

                            <div className="card-header">

                                <h4 className="card-title">
                                    Student Details
                                </h4>

                            </div>


                            <div className="card-body">

                                <div className="row">


                                    {/* FULL NAME */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Full Name

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>

                                        <input
                                            type="text"
                                            name="fullName"
                                            className="form-control"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* PHONE */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Phone Number

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control"
                                            value={formData.phone}
                                            maxLength={10}
                                            onChange={(e) => {

                                                const value =
                                                    e.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 10);

                                                setFormData((prev) => ({

                                                    ...prev,

                                                    phone: value,

                                                    teamMembers: [
                                                        {
                                                            ...prev.teamMembers[0],
                                                            phone: value,
                                                        },

                                                        ...prev.teamMembers.slice(1),
                                                    ],
                                                }));

                                            }}
                                            required
                                        />

                                    </div>


                                    {/* EMAIL */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Email

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* COLLEGE */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            College Name

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>

                                        <input
                                            type="text"
                                            name="collegeName"
                                            className="form-control"
                                            value={formData.collegeName}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* DEGREE */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Degree

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>

                                        <input
                                            type="text"
                                            name="degree"
                                            className="form-control"
                                            value={formData.degree}
                                            onChange={handleChange}
                                            placeholder="B.E / B.Tech / MCA"
                                            required
                                        />

                                    </div>


                                    {/* DEPARTMENT */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Department / Specialization

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>

                                        <input
                                            type="text"
                                            name="department"
                                            className="form-control"
                                            value={formData.department}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* ROLL NUMBER */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            College Roll No

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>

                                        <input
                                            type="text"
                                            name="collegeRollNo"
                                            className="form-control"
                                            value={formData.collegeRollNo}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* CITY */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            City

                                            <span className="text-danger">
                                                {" "}*
                                            </span>

                                        </label>

                                        <input
                                            type="text"
                                            name="city"
                                            className="form-control"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =====================================================
                            PROJECT DETAILS
                        ====================================================== */}

                        <div className="card mt-4">

                            <div className="card-header">

                                <h4 className="card-title">
                                    Project Details
                                </h4>

                            </div>


                            <div className="card-body">


                                {/* PROJECT TITLE */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        Project Title

                                        <span className="text-danger">
                                            {" "}*
                                        </span>

                                    </label>

                                    <input
                                        type="text"
                                        name="projectTitle"
                                        className="form-control"
                                        value={formData.projectTitle}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* DESCRIPTION */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        Project Description / Outline

                                        <span className="text-danger">
                                            {" "}*
                                        </span>

                                    </label>

                                    <textarea
                                        name="projectDescription"
                                        className="form-control"
                                        rows={5}
                                        value={
                                            formData.projectDescription
                                        }
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* ABSTRACT */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        Project Abstract

                                        <span className="text-danger">
                                            {" "}*
                                        </span>

                                    </label>

                                    <textarea
                                        name="projectAbstract"
                                        className="form-control"
                                        rows={7}
                                        value={
                                            formData.projectAbstract
                                        }
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                        </div>


                        {/* =====================================================
                            TEAM MEMBERS
                        ====================================================== */}

                        <div className="card mt-4">

                            <div className="card-header d-flex justify-content-between align-items-center">

                                <h4 className="card-title mb-0">
                                    Team Members
                                </h4>


                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={addTeamMember}
                                    disabled={
                                        formData.teamMembers.length >= 4
                                    }
                                >
                                    + Add Member
                                </button>

                            </div>


                            <div className="card-body">

                                <p className="text-muted">

                                    Minimum 2 members and maximum
                                    4 members are allowed.

                                </p>


                                {formData.teamMembers.map(
                                    (member, index) => (

                                        <div
                                            className="border rounded p-3 mb-3"
                                            key={index}
                                        >


                                            <div className="d-flex justify-content-between mb-3">

                                                <h5>

                                                    Team Member{" "}
                                                    {index + 1}

                                                    {index === 0 && (
                                                        <span className="text-muted">
                                                            {" "}
                                                            (Main Student)
                                                        </span>
                                                    )}

                                                </h5>


                                                {index >= 2 && (

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() =>
                                                            removeTeamMember(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </button>

                                                )}

                                            </div>


                                            <div className="row">


                                                {/* NAME */}

                                                <div className="col-md-4 mb-3">

                                                    <label className="form-label">

                                                        Name

                                                        <span className="text-danger">
                                                            {" "}*
                                                        </span>

                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            member.name
                                                        }
                                                        readOnly={
                                                            index === 0
                                                        }
                                                        onChange={(e) =>
                                                            handleTeamMemberChange(
                                                                index,
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />

                                                </div>


                                                {/* PHONE */}

                                                <div className="col-md-4 mb-3">

                                                    <label className="form-label">

                                                        Phone Number

                                                        <span className="text-danger">
                                                            {" "}*
                                                        </span>

                                                    </label>

                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        value={
                                                            member.phone
                                                        }
                                                        maxLength={10}
                                                        readOnly={
                                                            index === 0
                                                        }
                                                        onChange={(e) => {

                                                            const value =
                                                                e.target.value
                                                                    .replace(
                                                                        /\D/g,
                                                                        ""
                                                                    )
                                                                    .slice(
                                                                        0,
                                                                        10
                                                                    );

                                                            handleTeamMemberChange(
                                                                index,
                                                                "phone",
                                                                value
                                                            );

                                                        }}
                                                        required
                                                    />

                                                </div>


                                                {/* ROLL NUMBER */}

                                                <div className="col-md-4 mb-3">

                                                    <label className="form-label">

                                                        College Roll No

                                                        <span className="text-danger">
                                                            {" "}*
                                                        </span>

                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            member.collegeRollNo
                                                        }
                                                        readOnly={
                                                            index === 0
                                                        }
                                                        onChange={(e) =>
                                                            handleTeamMemberChange(
                                                                index,
                                                                "collegeRollNo",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        {/* =====================================================
                            SUBMIT
                        ====================================================== */}

                        {/* <div className="card mt-4">

                            <div className="card-body text-center">

                                <button
                                    type="submit"
                                    className="btn btn-success btn-lg px-5"
                                >
                                    Submit Registration
                                </button>

                            </div>

                        </div> */}
                        <div className="card mt-4">

                            <div className="card-body text-center">

                                <h5 className="mb-3">
                                    Registration Fee
                                </h5>

                                <h2 className="mb-3">
                                    ₹
                                    {formData.teamMembers.length * 125}
                                </h2>

                                <p className="text-muted">
                                    ₹125 per team member
                                </p>


                                <button
                                    type="submit"
                                    className="btn btn-success btn-lg px-5"
                                    disabled={paymentLoading}
                                >

                                    {paymentLoading
                                        ? "Processing..."
                                        : "Proceed to Payment"}

                                </button>

                            </div>

                        </div>


                    </form>

                </div>

            </div>
            {showSuccessModal && (

                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor:
                            "rgba(0,0,0,0.5)",
                    }}
                >

                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content">

                            <div className="modal-body text-center p-5">

                                <div
                                    className="mb-4"
                                    style={{
                                        fontSize: "60px",
                                    }}
                                >
                                    ✓
                                </div>


                                <h3 className="mb-3">
                                    Registration Successful!
                                </h3>


                                <p className="text-muted mb-4">

                                    Your Nexila Hackathon
                                    registration has been
                                    successfully completed.

                                    <br />

                                    Payment received successfully.

                                    <br />

                                    Registration details have
                                    been sent to your email.

                                </p>


                                <button
                                    type="button"
                                    className="btn btn-primary px-5"
                                    onClick={() => {

                                        setShowSuccessModal(
                                            false
                                        );

                                        setFormData(
                                            getInitialFormData()
                                        );

                                    }}
                                >
                                    OK
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}
        </div>
    );
};

export default NexilaHackathon;