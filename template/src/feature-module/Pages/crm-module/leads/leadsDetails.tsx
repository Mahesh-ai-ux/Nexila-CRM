
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import PageHeader from "../../../../components/page-header/pageHeader";
import { all_routes } from "../../../../routes/all_routes";

// TYPES
type Change = {
  field: string;
  oldvalue: any;
  newvalue: any;
};

type Log = {
  action: string;
  createdAt: string;
  payment?: {
    amount?: number;
    paymentMode?: string;
  };
  changes?: Change[];
};

// FIELD GROUPS
const FIELD_GROUPS: Record<string, string[]> = {
  basic: ["name", "phone", "email", "location"],
  education: ["collegename", "graduate", "category"],
  course: ["domain", "lookingfor", "internshipduration", "noofday"],
  finance: ["fees", "feepaid", "pendingfee", "feetype"],
  system: [
    "assignfrom",
    "assignto",
    "leadstatus",
    "followdate",
    "dateofjoin",
  ],
};

// LEAD TYPE
interface Lead {
  _id: string;
  nexilaID?: string;
  name: string;
  phone: string;
  email?: string;
  collegename?: string;
  collegeRegisterId?: string;
  address?: string;
  category?: string;
  leadsource?: string;
  leadstatus?: string;
  domain?: string;
  graduate?: string;
  lookingfor?: string;
  internshipduration?: string;
  remark?: string;
  domainreason?: string;
  dropreason?: string;
  followdate?: string;
  demodate?: string;
  dateofjoin?: string;
  fees?: string;
  feetype?: string;
  feepaid?: string;
  pendingfee?: string;
  noofday?: string;
  createdAt?: string;
  updatedAt?: string;

  // NEW PAYMENT FIELDS
  paymentStatus?: string;
  paymentMethod?: string;
  paymentReference?: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  paidAt?: string | null;
}

const LeadsDetails = () => {
  const { id } = useParams();

  const [lead, setLead] = useState<Lead | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH LEAD
  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");

    fetch(`/api/leads/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || !data.lead) {
          setLead(null);
          setLoading(false);
          return;
        }

        const l = data.lead;

        setLead({
          _id: l._id,
          nexilaID: l.nexilaID || "-",
          name: l.name || "-",
          phone: l.phone || "-",
          email: l.email || "-",
          collegename: l.collegename || "-",
          collegeRegisterId: l.collegeRegisterId || "-",
          address: l.location || "-",

          category: l.category || "-",
          leadsource: l.leadsource || "-",
          leadstatus: l.leadstatus || "-",

          domain: l.domain || "-",
          graduate: l.graduate || "-",

          lookingfor: l.lookingfor || "-",
          internshipduration: l.internshipduration || "-",
          remark: l.remark || "-",
          domainreason: l.domainreason || "-",
          dropreason: l.dropreason || "-",

          followdate: l.followdate
            ? new Date(l.followdate).toLocaleDateString()
            : "-",

          demodate: l.demodate
            ? new Date(l.demodate).toLocaleDateString()
            : "-",

          dateofjoin: l.dateofjoin
            ? new Date(l.dateofjoin).toLocaleDateString()
            : "-",

          fees: l.fees ?? "-",
          feetype: l.feetype || "-",
          feepaid: l.feepaid ?? "-",
          pendingfee: l.pendingfee ?? "-",
          noofday: l.noofday || "-",

          createdAt: l.createdAt
            ? new Date(l.createdAt).toLocaleString()
            : "-",

          updatedAt: l.updatedAt
            ? new Date(l.updatedAt).toLocaleString()
            : "-",

          // NEW PAYMENT DATA
          paymentStatus: l.paymentStatus || "PENDING",
          paymentMethod: l.paymentMethod || "MANUAL",
          paymentReference: l.paymentReference || "-",
          razorpayOrderId: l.razorpayOrderId || null,
          razorpayPaymentId: l.razorpayPaymentId || null,
          razorpaySignature: l.razorpaySignature || null,

          paidAt: l.paidAt
            ? new Date(l.paidAt).toLocaleString()
            : null,
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // FETCH LOGS
  useEffect(() => {
    if (!lead?._id) return;

    const token = localStorage.getItem("token");

    const fetchLogs = async () => {
      try {
        const res = await fetch(
          `/api/leads/logs/${lead._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const errText = await res.text();
          console.error("API Error:", errText);
          return;
        }

        const data = await res.json();

        console.log("LOGS:", data.logs);
        setLogs(data.logs || []);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchLogs();
  }, [lead?._id]);

  // LOADING
  if (loading) return <p>Loading lead details...</p>;
  if (!lead) return <p>No Lead Found</p>;

  // PAYMENT STATUS BADGE
  const paymentStatus = (
    lead.paymentStatus || "PENDING"
  ).toUpperCase();

  const paymentBadgeClass =
    paymentStatus === "PAID"
      ? "bg-success"
      : paymentStatus === "FAILED"
      ? "bg-danger"
      : "bg-warning text-dark";

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <PageHeader
          title="Leads"
          badgeCount={125}
          showModuleTile={false}
          showExport={true}
        />

        <div className="row">
          {/* BACK */}
          <div className="col-md-12 mb-2">
            <Link to={all_routes.leads}>← Back to Leads</Link>
          </div>

          {/* TOP CARD */}
          <div className="col-md-12">
            <div className="card">
              <div className="card-body d-flex align-items-center gap-3">
                <div
                  className="avatar bg-warning d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                  }}
                >
                  {lead.name?.charAt(0)?.toUpperCase()}
                </div>

                <div>
                  <h5 className="mb-1">{lead.name}</h5>
                  <p className="mb-1">
                    <b>{lead.nexilaID}</b>
                  </p>
                  <p className="mb-1">{lead.phone}</p>
                  <p className="mb-0 text-muted">{lead.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* LEFT - DETAILS */}
          <div className="col-xl-4">
            <div className="card p-3">
              <h5>Lead Information</h5>

              <p><b>Name:</b> {lead.name}</p>
              <p><b>Phone:</b> {lead.phone}</p>
              <p><b>Email:</b> {lead.email}</p>
              <p><b>College:</b> {lead.collegename}</p>
              <p><b>College Register ID:</b> {lead.collegeRegisterId}</p>
              <p><b>Location:</b> {lead.address}</p>

              <p><b>Category:</b> {lead.category}</p>
              <p><b>Source:</b> {lead.leadsource}</p>
              <p><b>Status:</b> {lead.leadstatus}</p>

              <p><b>Domain:</b> {lead.domain}</p>
              <p><b>Graduate:</b> {lead.graduate}</p>

              <p><b>Looking For:</b> {lead.lookingfor}</p>
              <p><b>Internship:</b> {lead.internshipduration}</p>

              <p><b>Remark:</b> {lead.remark}</p>
              <p><b>Domain Reason:</b> {lead.domainreason}</p>
              <p><b>Drop Reason:</b> {lead.dropreason}</p>

              <p><b>Follow Date:</b> {lead.followdate}</p>
              <p><b>Demo Date:</b> {lead.demodate}</p>
              <p><b>Join Date:</b> {lead.dateofjoin}</p>

              <p><b>Fees:</b> ₹{lead.fees}</p>
              <p><b>Fee Type:</b> {lead.feetype}</p>
              <p><b>Paid:</b> ₹{lead.feepaid}</p>
              <p><b>Pending:</b> ₹{lead.pendingfee}</p>

              <p><b>No of Days:</b> {lead.noofday}</p>

              <p><b>Created At:</b> {lead.createdAt}</p>
              <p><b>Updated At:</b> {lead.updatedAt}</p>
            </div>

            {/* NEW - PAYMENT INFORMATION */}
            <div className="card p-3">
              <h5 className="mb-3">
                <i className="ti ti-credit-card me-2" />
                Payment Information
              </h5>

              <p>
                <b>Payment Status:</b>{" "}
                <span
                  className={`badge ${paymentBadgeClass}`}
                >
                  {paymentStatus}
                </span>
              </p>

              <p>
                <b>Payment Method:</b>{" "}
                {lead.paymentMethod || "-"}
              </p>

              <p>
                <b>Payment Reference:</b>{" "}
                <span className="text-break">
                  {lead.paymentReference || "-"}
                </span>
              </p>

              <p>
                <b>Razorpay Order ID:</b>{" "}
                <span className="text-break">
                  {lead.razorpayOrderId || "-"}
                </span>
              </p>

              <p>
                <b>Razorpay Payment ID:</b>{" "}
                <span className="text-break">
                  {lead.razorpayPaymentId || "-"}
                </span>
              </p>

              <p>
                <b>Razorpay Signature:</b>{" "}
                <span className="text-break">
                  {lead.razorpaySignature
                    ? `${lead.razorpaySignature.slice(0, 16)}...`
                    : "-"}
                </span>
              </p>

              <p>
                <b>Paid At:</b> {lead.paidAt || "-"}
              </p>

              <small className="text-muted">
                Payment status is based on the information saved
                by the backend. A pending payment is not confirmed
                as successful.
              </small>
            </div>
          </div>

          {/* RIGHT - ACTIVITY */}
          <div className="col-xl-8">
            <div className="card">
              <div className="card-body pb-0 pt-2 px-2">
                <ul className="nav nav-tabs nav-bordered border-0 mb-0">
                  <li className="nav-item">
                    <button className="nav-link active">
                      Activities
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card-body">
                {logs.length === 0 && <p>No Activity Found</p>}

                {logs.map((log: Log, index: number) => {
                  let bg = "bg-info";
                  let icon = "ti ti-edit";
                  let title = "Lead Updated";

                  const fields =
                    log.changes?.map((c) => c.field) || [];

                  // CREATE NEW LEAD
                  if (
                    log.action === "create" &&
                    !fields.includes("fees")
                  ) {
                    bg = "bg-success";
                    icon = "ti ti-user-plus";
                    title = "New Lead Added";
                  }

                  // STUDENT CREATED
                  if (
                    log.action === "create" &&
                    fields.includes("fees")
                  ) {
                    bg = "bg-primary";
                    icon = "ti ti-school";
                    title = "Converted To Student";
                  }

                  // PAYMENT
                  if (log.action === "payment") {
                    bg = "bg-warning";
                    icon = "ti ti-cash";
                    title = "Payment Received";
                  }

                  // STATUS CHANGE
                  if (
                    log.action === "update" &&
                    fields.includes("leadstatus")
                  ) {
                    const statusChange = log.changes?.find(
                      (x) => x.field === "leadstatus"
                    );

                    const oldStatus = statusChange?.oldvalue || "";
                    const newStatus = statusChange?.newvalue || "";

                    if (newStatus === "Demo Scheduled") {
                      bg = "bg-primary";
                      icon = "ti ti-calendar-event";
                      title = "Demo Scheduled";
                    } else if (
                      newStatus === "Follow Up 1" ||
                      newStatus === "Follow Up1"
                    ) {
                      bg = "bg-secondary";
                      icon = "ti ti-calendar-time";
                      title = "Follow Up Scheduled";
                    } else if (newStatus === "Dropout") {
                      bg = "bg-danger";
                      icon = "ti ti-user-x";
                      title = "Lead Dropped";
                    } else if (newStatus === "Student") {
                      bg = "bg-success";
                      icon = "ti ti-school";
                      title = "Converted To Student";
                    } else {
                      bg = "bg-info";
                      icon = "ti ti-refresh";

                      title =
                        oldStatus && newStatus
                          ? `${oldStatus} → ${newStatus}`
                          : "Status Changed";
                    }
                  }

                  // GROUP CHANGES
                  const grouped: Record<string, Change[]> = {
                    basic: [],
                    education: [],
                    course: [],
                    finance: [],
                    system: [],
                  };

                  if (log.changes && Array.isArray(log.changes)) {
                    for (let i = 0; i < log.changes.length; i++) {
                      const c = log.changes[i];

                      if (!c || !c.field) continue;

                      if (
                        [
                          "__v",
                          "_id",
                          "leadid",
                          "studentid",
                          "updatedby",
                        ].includes(c.field)
                      ) {
                        continue;
                      }

                      for (const group in FIELD_GROUPS) {
                        const groupFields = FIELD_GROUPS[group];

                        if (groupFields.includes(c.field)) {
                          grouped[group].push(c);
                        }
                      }
                    }
                  }

                  return (
                    <div
                      key={index}
                      className="card border shadow-none mb-3"
                    >
                      <div className="card-body p-3">
                        <div className="d-flex">
                          {/* ICON */}
                          <span
                            className={`avatar avatar-md me-2 ${bg}`}
                          >
                            <i className={`${icon} fs-20`} />
                          </span>

                          <div className="flex-grow-1">
                            {/* TITLE */}
                            <h6 className="fw-semibold mb-1">
                              {title}
                            </h6>

                            {/* DATE */}
                            {log.action !== "create" &&
                              log.action !== "update" && (
                                <p
                                  className="text-muted mb-2"
                                  style={{ fontSize: "12px" }}
                                >
                                  {new Date(
                                    log.createdAt
                                  ).toLocaleString()}
                                </p>
                              )}

                            {/* PAYMENT LOG */}
                            {log.action === "payment" &&
                              log.payment && (
                                <div className="alert alert-warning py-2 px-3 mb-2 small">
                                  ₹ {log.payment.amount || "-"} paid
                                  via {log.payment.paymentMode || "-"}
                                </div>
                              )}

                            {/* STATUS DETAILS */}
                            {log.action === "update" &&
                              fields.includes("leadstatus") && (
                                <div className="small mb-2">
                                  <div>
                                    Status:{" "}
                                    <b>
                                      {
                                        log.changes?.find(
                                          (x) =>
                                            x.field === "leadstatus"
                                        )?.newvalue
                                      }
                                    </b>
                                  </div>

                                  <div className="text-muted mt-1">
                                    {new Date(
                                      log.createdAt
                                    ).toLocaleString()}
                                  </div>
                                </div>
                              )}

                            {/* NORMAL CHANGES */}
                            {log.action !== "update" &&
                              log.changes && (
                                <div className="small">
                                  {log.action === "create" &&
                                    !fields.includes("fees") && (
                                      <div className="small mb-2">
                                        <div>
                                          Lead Status:{" "}
                                          <b>
                                            {log.changes?.find(
                                              (x) =>
                                                x.field === "leadstatus"
                                            )?.newvalue || "-"}
                                          </b>
                                        </div>

                                        <div className="text-muted mt-1">
                                          {new Date(
                                            log.createdAt
                                          ).toLocaleString()}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsDetails;
