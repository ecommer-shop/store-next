export default function PaymentMethodsLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96" />
            </div>

            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded-md" />
                            <div className="flex-1 space-y-2">
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
