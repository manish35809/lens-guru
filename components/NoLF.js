export default function NoLF({clear}) {
    return (
        <div className="text-center py-16">
                <div className="text-xl text-gray-500 mb-6 font-medium">
                  No lenses found matching your criteria
                </div>
                <button
                  onClick={clear}
                  className="text-blue-600 hover:text-blue-800 font-bold text-lg px-6 py-3 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Clear filters and try again
                </button>
              </div>
    )
}