import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    ResponsiveContainer,
} from "recharts";
import axios from "../helper/Axios";

const HRResumeStatistics = () => {
    const [resumes, setResumes] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [active, setActive] = useState(null);
    const [activeTab, setActiveTab] = useState("selected");
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hrData = localStorage.getItem("user");
                const parsedUser = hrData ? JSON.parse(hrData) : null;
                if (!parsedUser) throw new Error("User data not found");
                
                const statsResponse = await axios.get(`/api/Total_resumeUploaded_by_hr/`, {
                    params: { hr_id: parsedUser.user_id },
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                const resumesResponse = await axios.get(`/api/get_resumes_analysis_report/`, {
                    params: { hr_id: parsedUser.user_id },
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                setStats(statsResponse.data);
                setResumes(resumesResponse.data);
            } catch (err) {
                setError(err.message || "An error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;
    if (!resumes.length || !stats) return <div className="no-data">No data available</div>;

    const barChartData = [
        { name: "Uploaded", value: stats.total_uploaded || 0, fill: "#0EA5E9" },
        { name: "Selected", value: stats.total_selected || 0, fill: "#10B981" },
        { name: "Rejected", value: stats.total_rejected || 0, fill: "#EF4444" },
    ];

    const filteredResumes =
        activeTab === "selected"
            ? resumes.filter(resume => resume.resume_status === "resume selected")
            : resumes.filter(resume => resume.resume_status !== "resume selected");

    return (
        <div className="statistics-container">
            <h1 className="title">HR Resume Analytics</h1>
            <div className="stats-cards">
                {barChartData.map(stat => (
                    <div key={stat.name} className="stat-card" style={{ color: stat.fill }}>
                        <h3>{stat.name} Resumes</h3>
                        <p>{stat.value}</p>
                    </div>
                ))}
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value">
                            {barChartData.map((entry, index) => (
                                <Cell key={index} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="resume-tabs">
                <button onClick={() => setActiveTab("selected")} className={activeTab === "selected" ? "active" : ""}>Selected Resumes</button>
                <button onClick={() => setActiveTab("rejected")} className={activeTab === "rejected" ? "active" : ""}>Rejected Resumes</button>
            </div>
            {filteredResumes.map((resume, index) => (
                <div key={index} className={`resume-card ${resume.resume_status === 'resume selected' ? 'selected' : 'rejected'}`}>
                    <button onClick={() => setActive(active === index ? null : index)}>{active === index ? "Hide Details" : "Show Details"}</button>
                    <h3>{resume.candidate_info.name}</h3>
                    <p>Email: {resume.candidate_email}</p>
                    <p>Phone: {resume.candidate_info.phone}</p>
                    <p>Status: {resume.resume_status.toUpperCase()}</p>
                    <p>Job Title: {resume.job_title}</p>
                    <p>Uploaded At: {new Date(resume.uploaded_at).toLocaleString()}</p>
                    {active === index && (
                        <div className="details">
                            <p>Overall Score: {resume.overall_score}</p>
                            <p>Relevance: {resume.relevance}/10</p>
                            <p>Skills Fit: {resume.skills_fit}/10</p>
                            <p>Cultural Fit: {resume.cultural_fit}/10</p>
                            <div>
                                <h4>Strengths</h4>
                                <ul>{resume.strengths.map((s, idx) => <li key={idx}>{s}</li>)}</ul>
                            </div>
                            <div>
                                <h4>Weaknesses</h4>
                                <ul>{resume.weaknesses.map((w, idx) => <li key={idx}>{w}</li>)}</ul>
                            </div>
                            <div>
                                <h4>Recommendations</h4>
                                <ul>{resume.recommendations.map((r, idx) => <li key={idx}>{r}</li>)}</ul>
                            </div>
                            <div>
                                <h4>Missing Elements</h4>
                                <ul>{resume.missing_elements.map((e, idx) => <li key={idx}>{e}</li>)}</ul>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default HRResumeStatistics;
