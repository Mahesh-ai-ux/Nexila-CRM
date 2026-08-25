import React, { useState } from "react";

const HackathonForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        college: "",
        project: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Hackathon Registration:", formData);

        alert("Hackathon registration submitted!");
    };

    return (
        <div>
            <h1>Hackathon Registration</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <br />
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                    />
                </div>

                <br />

                <div>
                    <label>Email</label>
                    <br />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                </div>

                <br />

                <div>
                    <label>Phone</label>
                    <br />
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                    />
                </div>

                <br />

                <div>
                    <label>College</label>
                    <br />
                    <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        placeholder="Enter your college"
                    />
                </div>

                <br />

                <div>
                    <label>Project</label>
                    <br />
                    <textarea
                        name="project"
                        value={formData.project}
                        onChange={handleChange}
                        placeholder="Enter your project idea"
                    />
                </div>

                <br />

                <button type="submit">
                    Register
                </button>
            </form>
        </div>
    );
};

export default HackathonForm;