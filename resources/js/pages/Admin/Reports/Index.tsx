import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    FileText,
    Calendar,
    Users,
    CheckSquare,
    Download,
    Eye,
    Settings,
    BarChart3,
    Clock,
    DollarSign,
    Filter
} from 'lucide-react';

interface ReportType {
    id: string;
    title: string;
    description: string;
    icon: string;
    available: boolean;
}

interface ReportsIndexProps {
    reportTypes: ReportType[];
    recentReports: any[];
    quickStats: {
        total_events: number;
        total_registrations: number;
        total_check_ins: number;
        reports_generated_today: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '/admin/reports' },
];

export default function ReportsIndex({ reportTypes, recentReports, quickStats }: ReportsIndexProps) {
    const getIconComponent = (iconName: string) => {
        const icons: { [key: string]: any } = {
            Calendar,
            Users,
            CheckSquare,
            DollarSign,
            Settings,
        };
        return icons[iconName] || FileText;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports Dashboard - Festival Tahuri Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 sm:p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                            Reports Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Generate dan download laporan comprehensive untuk semua event
                        </p>
                    </div>
                    
                    {/* Advanced report scheduler (commented for future implementation) */}
                    {/*
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Schedule Report
                        </button>
                        <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Report Settings
                        </button>
                    </div>
                    */}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-700 font-medium text-xs sm:text-sm">Total Events</p>
                                <p className="text-xl sm:text-3xl font-bold text-blue-900">{quickStats.total_events}</p>
                            </div>
                            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-700 font-medium text-xs sm:text-sm">Total Registrasi</p>
                                <p className="text-xl sm:text-3xl font-bold text-green-900">{quickStats.total_registrations}</p>
                            </div>
                            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-700 font-medium text-xs sm:text-sm">Total Check-in</p>
                                <p className="text-xl sm:text-3xl font-bold text-purple-900">{quickStats.total_check_ins}</p>
                            </div>
                            <CheckSquare className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-700 font-medium text-xs sm:text-sm">Reports Hari Ini</p>
                                <p className="text-xl sm:text-3xl font-bold text-orange-900">{quickStats.reports_generated_today}</p>
                            </div>
                            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Available Reports */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Reports</h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {reportTypes.map((report) => {
                            const IconComponent = getIconComponent(report.icon);
                            
                            return (
                                <div
                                    key={report.id}
                                    className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                                        report.available
                                            ? 'border-orange-200 hover:border-orange-300 hover:shadow-md cursor-pointer bg-white'
                                            : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${
                                            report.available
                                                ? 'bg-orange-100 text-orange-600'
                                                : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-2">{report.title}</h4>
                                            <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                                            
                                            {report.available ? (
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/admin/reports/${report.id.replace('_', '-')}`}
                                                        className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Generate
                                                    </Link>
                                                    
                                                    {/* Export buttons (commented for future implementation) */}
                                                    {/*
                                                    <button className="px-3 py-1 border border-orange-300 text-orange-700 hover:bg-orange-50 text-sm font-medium rounded-lg transition-colors flex items-center gap-1">
                                                        <Download className="w-4 h-4" />
                                                        PDF
                                                    </button>
                                                    <button className="px-3 py-1 border border-green-300 text-green-700 hover:bg-green-50 text-sm font-medium rounded-lg transition-colors flex items-center gap-1">
                                                        <Download className="w-4 h-4" />
                                                        Excel
                                                    </button>
                                                    */}
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg">
                                                    Coming Soon
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Reports (placeholder for future implementation) */}
                {/*
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
                        <Link 
                            href="/admin/reports/history"
                            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                        >
                            View All History
                        </Link>
                    </div>
                    
                    {recentReports.length > 0 ? (
                        <div className="space-y-3">
                            {recentReports.map((report, index) => (
                                <div key={`report-${report.title}-${index}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{report.title}</p>
                                            <p className="text-sm text-gray-600">Generated on {report.created_at}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                            {report.format.toUpperCase()}
                                        </span>
                                        <button className="p-2 text-gray-400 hover:text-gray-600">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                            <p className="text-gray-500">No reports generated yet</p>
                            <p className="text-sm text-gray-400">Generate your first report above</p>
                        </div>
                    )}
                </div>
                */}

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Link
                            href="/admin/reports/event-summary"
                            className="p-4 bg-white border border-orange-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 text-center group"
                        >
                            <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-medium text-gray-900">Event Summary</p>
                            <p className="text-sm text-gray-600">All events overview</p>
                        </Link>
                        
                        <Link
                            href="/admin/reports/registration-list"
                            className="p-4 bg-white border border-orange-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 text-center group"
                        >
                            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-medium text-gray-900">Registration List</p>
                            <p className="text-sm text-gray-600">Detailed participant list</p>
                        </Link>
                        
                        <Link
                            href="/admin/analytics"
                            className="p-4 bg-white border border-orange-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 text-center group"
                        >
                            <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-medium text-gray-900">Analytics Data</p>
                            <p className="text-sm text-gray-600">Statistical insights</p>
                        </Link>
                        
                        {/* Advanced custom report builder (commented) */}
                        {/*
                        <div className="p-4 bg-white border border-gray-200 rounded-lg opacity-60 text-center">
                            <Settings className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="font-medium text-gray-500">Custom Report</p>
                            <p className="text-sm text-gray-400">Build custom reports</p>
                            <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                                Coming Soon
                            </span>
                        </div>
                        */}
                    </div>
                </div>

                {/* Report Templates Information */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Information</h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Available Formats</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    PDF - Formatted reports for printing and sharing
                                </li>
                                {/* Commented advanced formats */}
                                {/*
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    Excel - Spreadsheet data for analysis
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    CSV - Raw data for database import
                                </li>
                                */}
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Report Features</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    Real-time data from database
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    Customizable date ranges and filters
                                </li>
                                {/* Commented advanced features */}
                                {/*
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    Automated email delivery
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                    Scheduled report generation
                                </li>
                                */}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}