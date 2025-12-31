import React from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);

const SkillGapChart = ({ data }) => {
    // Default data if none provided
    const chartData = data?.radarChartData || {
        labels: ['Technical', 'Soft Skills', 'Domain', 'Tools', 'Leadership', 'Impact'],
        current: [5, 5, 5, 5, 5, 5],
        required: [8, 8, 8, 8, 8, 8]
    };

    const radarData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Your Profile',
                data: chartData.current,
                backgroundColor: 'rgba(139, 92, 246, 0.2)', // Violet
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(139, 92, 246, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(139, 92, 246, 1)',
            },
            {
                label: 'Target Role',
                data: chartData.required,
                backgroundColor: 'rgba(59, 130, 246, 0.2)', // Blue
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            r: {
                angleLines: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                pointLabels: {
                    color: '#94a3b8',
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    }
                },
                ticks: {
                    display: false,
                    backdropColor: 'transparent'
                },
                suggestedMin: 0,
                suggestedMax: 10
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#e2e8f0',
                    font: {
                        family: "'Inter', sans-serif"
                    }
                }
            }
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <Radar data={radarData} options={options} />
        </div>
    );
};

export default SkillGapChart;
