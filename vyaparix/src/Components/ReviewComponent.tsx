import Review from "./Modals/Review";

const ReviewComponent = ({ username, rating, comment }: { username: string, rating: number, comment?: string }) => {
    return (
        <div>
            <div className=" gap-3 py-6 sm:flex sm:items-start">
                <div className="shrink-0 space-y-2 sm:w-48 md:w-72">


                    <div className="space-y-0.5">
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {username}
                        </p>

                    </div>
                    <div className="inline-flex items-center gap-1">
                        <svg
                            className="h-5 w-5 text-primary-700 dark:text-primary-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Verified purchase
                        </p>
                    </div>
                </div>
                <div className="mt-4 min-w-0 flex-1 space-y-4 sm:mt-0">
                    <div className="text-base font-normal text-gray-500 dark:text-gray-400">
                        <Review rating={rating} />
                        {comment ? comment : "I loved the product so much.  5/5"}
                    </div>

                </div>
            </div>
        </div>


    );
}

export default ReviewComponent
