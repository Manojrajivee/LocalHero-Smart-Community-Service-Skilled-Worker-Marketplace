import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats, getAllBookings } from '../../services/api';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const adminStats = await getAdminStats();
        setStats(adminStats);

        const allBookings = await getAllBookings();
        setBookings(allBookings);

        const sorted = [...allBookings].sort((a, b) => b.id.localeCompare(a.id));
        setRecentBookings(sorted.slice(0, 5));
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5 text-white">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // --- Calculations ---
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  const pendingBookingsCount = bookings.filter(b => b.status === 'PENDING').length;
  
  // Calculate total earnings from completed bookings
  const totalEarnings = stats ? stats.totalRevenue : completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Calculate this month's earnings
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-based
  const thisMonthBookings = completedBookings.filter(b => {
    const dateStr = b.date || b.bookingDate;
    if (!dateStr) return false;
    const parts = dateStr.split('-');
    if (parts.length < 2) return false;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    return year === currentYear && month === currentMonth;
  });
  const thisMonthEarnings = thisMonthBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Parse Year-Month key: e.g. "2026-06"
  const getMonthYearKey = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length < 2) return '';
    return `${parts[0]}-${String(parts[1]).padStart(2, '0')}`;
  };

  // Group monthly revenue for the last 6 months
  const getMonthlyRevenueData = () => {
    const monthlyMap = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const key = `${y}-${m}`;
      monthlyMap[key] = {
        label: `${MONTH_NAMES[d.getMonth()]} ${y}`,
        revenue: 0,
        key: key
      };
    }

    completedBookings.forEach(b => {
      const key = getMonthYearKey(b.date || b.bookingDate);
      if (key && monthlyMap[key]) {
        monthlyMap[key].revenue += Number(b.totalAmount || 0);
      }
    });

    return Object.values(monthlyMap);
  };

  // Group service distribution (top 5)
  const getServiceDistribution = () => {
    const counts = {};
    bookings.forEach(b => {
      const s = b.service || 'Other';
      counts[s] = (counts[s] || 0) + 1;
    });

    return Object.keys(counts).map(service => ({
      service,
      count: counts[service]
    })).sort((a, b) => b.count - a.count);
  };

  // Group status distribution for donut chart
  const getStatusDistribution = () => {
    const total = bookings.length;
    if (total === 0) return [];

    const statusCounts = {
      COMPLETED: { count: 0, color: '#10b981', label: 'Completed' },
      PENDING: { count: 0, color: '#f59e0b', label: 'Pending' },
      ACCEPTED: { count: 0, color: '#06b6d4', label: 'Accepted' },
      REJECTED: { count: 0, color: '#ef4444', label: 'Rejected' },
      CANCELLED: { count: 0, color: '#6b7280', label: 'Cancelled' }
    };

    bookings.forEach(b => {
      const status = (b.status || 'PENDING').toUpperCase();
      if (statusCounts[status]) {
        statusCounts[status].count++;
      } else {
        if (status === 'DECLINED') {
          statusCounts.REJECTED.count++;
        } else {
          statusCounts.CANCELLED.count++;
        }
      }
    });

    return Object.keys(statusCounts)
      .map(key => ({
        status: statusCounts[key].label,
        count: statusCounts[key].count,
        percentage: total > 0 ? Math.round((statusCounts[key].count / total) * 100) : 0,
        color: statusCounts[key].color
      }))
      .filter(item => item.count > 0);
  };

  const monthlyRevenueData = getMonthlyRevenueData();
  const serviceDistribution = getServiceDistribution();
  const statusDistribution = getStatusDistribution();

  // --- SVG Chart Renderers ---
  const renderRevenueChart = (data) => {
    const maxRevenue = Math.max(...data.map(d => d.revenue), 100);
    const width = 500;
    const height = 220;
    const paddingLeft = 50;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const points = data.map((d, idx) => {
      const x = paddingLeft + (idx * (chartWidth / (data.length - 1)));
      const y = paddingTop + chartHeight - ((d.revenue / maxRevenue) * chartHeight);
      return { x, y, label: d.label, revenue: d.revenue };
    });

    const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = points.length > 0 
      ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
      : '';

    return (
      <div className="position-relative w-100">
        <h5 className="text-white mb-4 text-start small text-uppercase tracking-wider">
          <i className="bi bi-graph-up me-2 text-success"></i>Monthly Revenue Trend
        </h5>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-100 h-auto" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + chartHeight * ratio;
            const value = Math.round(maxRevenue * (1 - ratio));
            return (
              <g key={idx} className="opacity-10">
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#fff" strokeWidth="1" strokeDasharray="3 3" />
                <text x={paddingLeft - 10} y={y + 4} fill="#fff" fontSize="9" textAnchor="end">${value}</text>
              </g>
            );
          })}

          {/* Paths */}
          {areaPath && <path d={areaPath} fill="url(#areaGrad)" className="animate-fade-in" />}
          {linePath && (
            <path 
              d={linePath} 
              fill="none" 
              stroke="url(#lineGrad)" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="animate-draw-line"
            />
          )}

          {/* Interactive Dots */}
          {points.map((p, idx) => (
            <g key={idx} className="chart-point-group">
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="4.5" 
                fill="#10b981" 
                stroke="#0f172a" 
                strokeWidth="2" 
                style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}
              />
              <text x={p.x} y={p.y - 12} fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle" className="chart-tooltip-text">
                ${Math.round(p.revenue)}
              </text>
              <text x={p.x} y={paddingTop + chartHeight + 20} fill="#94a3b8" fontSize="9" textAnchor="middle">
                {p.label.split(' ')[0]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const renderBarChart = (data) => {
    const chartData = data.slice(0, 5);
    const maxCount = Math.max(...chartData.map(d => d.count), 1);
    const width = 500;
    const height = 220;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const barWidth = Math.min(chartWidth / (chartData.length * 1.8), 36);
    const spacing = (chartWidth - (barWidth * chartData.length)) / (chartData.length + 1);

    return (
      <div className="position-relative w-100">
        <h5 className="text-white mb-4 text-start small text-uppercase tracking-wider">
          <i className="bi bi-bar-chart-line me-2 text-info"></i>Bookings by Service
        </h5>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-100 h-auto" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + chartHeight * ratio;
            const value = Math.round(maxCount * (1 - ratio));
            return (
              <g key={idx} className="opacity-10">
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#fff" strokeWidth="1" />
                <text x={paddingLeft - 10} y={y + 4} fill="#fff" fontSize="9" textAnchor="end">{value}</text>
              </g>
            );
          })}

          {/* Bars */}
          {chartData.map((d, idx) => {
            const x = paddingLeft + spacing + idx * (barWidth + spacing);
            const barHeight = (d.count / maxCount) * chartHeight;
            const y = paddingTop + chartHeight - barHeight;

            return (
              <g key={idx} className="bar-group">
                <rect 
                  x={x} 
                  y={y} 
                  width={barWidth} 
                  height={barHeight} 
                  fill="url(#barGrad)" 
                  rx="4" 
                  style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}
                />
                <text x={x + barWidth / 2} y={y - 8} fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {d.count}
                </text>
                <text x={x + barWidth / 2} y={paddingTop + chartHeight + 18} fill="#94a3b8" fontSize="8.5" textAnchor="middle">
                  {d.service.length > 9 ? `${d.service.substring(0, 7)}..` : d.service}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderDonutChart = (data) => {
    const r = 50;
    const circumference = 2 * Math.PI * r;
    let accumulatedPercentage = 0;

    return (
      <div className="position-relative w-100">
        <h5 className="text-white mb-4 text-start small text-uppercase tracking-wider">
          <i className="bi bi-pie-chart me-2 text-warning"></i>Job Status Distribution
        </h5>

        <div className="row align-items-center">
          <div className="col-6 text-center">
            <svg width="130" height="130" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
              {data.map((d, idx) => {
                const strokeDashoffset = circumference - (d.percentage / 100) * circumference;
                const rotation = (accumulatedPercentage / 100) * 360;
                accumulatedPercentage += d.percentage;

                return (
                  <circle
                    key={idx}
                    cx="70"
                    cy="70"
                    r={r}
                    fill="transparent"
                    stroke={d.color}
                    strokeWidth="15"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(${rotation} 70 70)`}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                  />
                );
              })}
              {/* Inner Cutout */}
              <circle cx="70" cy="70" r="39" fill="#151d30" />
            </svg>
          </div>

          <div className="col-6">
            <div className="d-flex flex-column gap-2 text-start">
              {data.map((d, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between gap-1 small">
                  <div className="d-flex align-items-center gap-2">
                    <span className="d-inline-block rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: d.color }}></span>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>{d.status}</span>
                  </div>
                  <span className="text-white fw-semibold" style={{ fontSize: '0.8rem' }}>{d.count} ({d.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in text-white pb-5">
      {/* CSS injection for animations and chart tooltips */}
      <style dangerouslySetInnerHTML={{ __html: `
        .chart-point-group .chart-tooltip-text {
          opacity: 0;
          transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
          transform: translateY(4px);
        }
        .chart-point-group:hover .chart-tooltip-text {
          opacity: 1;
          transform: translateY(0);
        }
        .chart-point-group:hover circle {
          r: 7 !important;
          fill: #34d399 !important;
        }
        .bar-group:hover rect {
          fill: #22d3ee !important;
          opacity: 0.95;
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        .animate-draw-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawLine 1.5s ease-out forwards;
        }
      `}} />

      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="display-6 mb-1">Administrative Control Panel</h1>
          <p className="text-muted mb-0">Platform overview, user activity auditing, and worker approvals</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/verification" className="btn btn-gradient-secondary btn-sm d-flex align-items-center gap-1.5 py-2">
            <i className="bi bi-shield-check"></i> Verify Workers
          </Link>
          <Link to="/admin/users" className="btn btn-glass btn-sm d-flex align-items-center gap-1.5 py-2">
            <i className="bi bi-people"></i> Manage Users
          </Link>
        </div>
      </div>

      {/* High-visibility Action Pending Banner */}
      {stats && stats.unverifiedWorkers > 0 && (
        <div className="alert alert-warning border-0 bg-warning bg-opacity-10 text-warning rounded-3 p-3 mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 animate-fade-in">
          <div>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            You have <strong>{stats.unverifiedWorkers}</strong> worker accounts awaiting credential auditing and approval.
          </div>
          <Link to="/admin/verification" className="btn btn-warning btn-sm fw-semibold px-3 py-1.5">
            Review Approvals
          </Link>
        </div>
      )}

      {/* Global Stat widgets */}
      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="dashboard-stat-card glass-card border-0 p-3">
              <div>
                <span className="text-muted small text-uppercase" style={{ fontSize: '0.75rem' }}>Total Earnings</span>
                <h4 className="fs-4 mb-0 mt-1">${totalEarnings}</h4>
              </div>
              <div className="dashboard-stat-icon bg-success bg-opacity-15 text-success" style={{ width: '36px', height: '36px', fontSize: '1.2rem' }}>
                <i className="bi bi-wallet2"></i>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="dashboard-stat-card glass-card border-0 p-3">
              <div>
                <span className="text-muted small text-uppercase" style={{ fontSize: '0.75rem' }}>This Month</span>
                <h4 className="fs-4 mb-0 mt-1">${thisMonthEarnings}</h4>
              </div>
              <div className="dashboard-stat-icon bg-info bg-opacity-15 text-info" style={{ width: '36px', height: '36px', fontSize: '1.2rem' }}>
                <i className="bi bi-graph-up-arrow"></i>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="dashboard-stat-card glass-card border-0 p-3">
              <div>
                <span className="text-muted small text-uppercase" style={{ fontSize: '0.75rem' }}>Completed Jobs</span>
                <h4 className="fs-4 mb-0 mt-1">{completedBookings.length}</h4>
              </div>
              <div className="dashboard-stat-icon bg-teal bg-opacity-15 text-success" style={{ width: '36px', height: '36px', fontSize: '1.2rem', backgroundColor: 'rgba(20, 184, 166, 0.15)', color: '#2dd4bf' }}>
                <i className="bi bi-check2-circle"></i>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="dashboard-stat-card glass-card border-0 p-3">
              <div>
                <span className="text-muted small text-uppercase" style={{ fontSize: '0.75rem' }}>Pending Jobs</span>
                <h4 className="fs-4 mb-0 mt-1">{pendingBookingsCount}</h4>
              </div>
              <div className="dashboard-stat-icon bg-warning bg-opacity-15 text-warning" style={{ width: '36px', height: '36px', fontSize: '1.2rem' }}>
                <i className="bi bi-hourglass-split"></i>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="dashboard-stat-card glass-card border-0 p-3">
              <div>
                <span className="text-muted small text-uppercase" style={{ fontSize: '0.75rem' }}>Total Users</span>
                <h4 className="fs-4 mb-0 mt-1">{stats.totalUsers}</h4>
              </div>
              <div className="dashboard-stat-icon bg-primary bg-opacity-15 text-primary" style={{ width: '36px', height: '36px', fontSize: '1.2rem' }}>
                <i className="bi bi-people-fill"></i>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-4 col-sm-6">
            <div className="dashboard-stat-card glass-card border-0 p-3">
              <div>
                <span className="text-muted small text-uppercase" style={{ fontSize: '0.75rem' }}>Pending Review</span>
                <h4 className="fs-4 mb-0 mt-1 text-warning">{stats.unverifiedWorkers || 0}</h4>
              </div>
              <div className="dashboard-stat-icon bg-danger bg-opacity-15 text-danger" style={{ width: '36px', height: '36px', fontSize: '1.2rem', backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
                <i className="bi bi-shield-exclamation"></i>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Row 1: Area Trend & Donut Status */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card glass-card border-0 p-4 h-100 d-flex align-items-center justify-content-center">
            {renderRevenueChart(monthlyRevenueData)}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card glass-card border-0 p-4 h-100 d-flex align-items-center justify-content-center">
            {renderDonutChart(statusDistribution)}
          </div>
        </div>
      </div>

      {/* Analytics Row 2: Bar Chart & Recent Activity */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card glass-card border-0 p-4 h-100 d-flex align-items-center justify-content-center">
            {renderBarChart(serviceDistribution)}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card glass-card border-0 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="text-white mb-0">Recent Platform Activity</h4>
              <Link to="/admin/bookings" className="text-info text-decoration-none small">
                Audit Bookings <i className="bi bi-chevron-right"></i>
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="text-center py-5 text-muted small">
                No booking history logged on the platform yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table custom-table mb-0">
                  <thead>
                    <tr>
                      <th>Ref ID</th>
                      <th>Customer</th>
                      <th>Worker</th>
                      <th>Service</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <span className="fw-mono text-muted small">#{booking.id?.substring(0, 8)}..</span>
                        </td>
                        <td>{booking.customerName}</td>
                        <td>{booking.workerName}</td>
                        <td>{booking.service}</td>
                        <td>
                          <span className={`badge-status-${booking.status?.toLowerCase()}`} style={{ fontSize: '0.75rem' }}>
                            {booking.status?.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

