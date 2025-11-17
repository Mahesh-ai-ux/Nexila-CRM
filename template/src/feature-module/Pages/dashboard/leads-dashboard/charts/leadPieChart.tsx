import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import type { ApexOptions } from "apexcharts";

const API_URL="http://localhost:5000";
interface Lead {
  leadstatus: string;
  createdAt: string;
}

interface LeadPieChartProps {
  days: number;
}

const LeadPieChart: React.FC<LeadPieChartProps> = ({ days }) => {
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  // 🎨 Dark color palette generator
  const darkColors = [
    "#1E3A8A", // navy blue
    "#2563EB", // royal blue
    "#065F46", // dark green
    "#78350F", // dark brown
    "#7C2D12", // deep orange
    "#4A044E", // purple
    "#991B1B", // dark red
    "#0F172A", // charcoal
    "#312E81", // indigo
    "#064E3B", // forest green
  ];

  const generateDarkColors = (count: number) => {
    return Array.from({ length: count }, (_, i) => darkColors[i % darkColors.length]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`📊 Fetching leads for last ${days} days...`);
        const res = await axios.get(`${API_URL}/api/leads`);
        const leads: Lead[] = res.data;

        // Filter by date range (createdAt within N days)
        const filteredLeads = leads.filter((lead) => {
          if (!lead.createdAt) return false;
          const createdDate = new Date(lead.createdAt);
          const now = new Date();
          const diffDays = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
          return diffDays <= days;
        });

        if (filteredLeads.length === 0) {
          console.warn("⚠️ No leads found in the selected range.");
          setLabels([]);
          setSeries([]);
          return;
        }

        // Group by leadstatus
        const statusCount: Record<string, number> = {};
        filteredLeads.forEach((lead) => {
          if (lead.leadstatus) {
            statusCount[lead.leadstatus] = (statusCount[lead.leadstatus] || 0) + 1;
          }
        });

        const statuses = Object.keys(statusCount);
        const counts = Object.values(statusCount);
        const dynamicColors = generateDarkColors(statuses.length);

        setLabels(statuses);
        setSeries(counts);
        setColors(dynamicColors);

        console.log("✅ Lead summary:", statusCount);
      } catch (error) {
        console.error("❌ Error fetching leads:", error);
      }
    };

    fetchData();
  }, [days]);

  const options: ApexOptions = {
    chart: { type: "pie", height: 440 },
    colors: colors,
    labels: labels,
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
    responsive: [
      {
        breakpoint: 1199,
        options: { chart: { height: 350 } },
      },
      {
        breakpoint: 575,
        options: { chart: { height: 280 } },
      },
    ],
  };

  return (
    <div>
      {series.length > 0 ? (
        <Chart options={options} series={series} type="pie" height={440} />
      ) : (
        <p className="text-center text-muted">No lead data for last {days} days</p>
      )}
    </div>
  );
};

export default LeadPieChart;