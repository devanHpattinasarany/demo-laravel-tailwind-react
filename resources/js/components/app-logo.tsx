export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
                <span className="text-xs font-bold">FT</span>
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                    Festival Tahuri Admin
                </span>
            </div>
        </>
    );
}
