export default function FAQs() {
    return (
        <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
                    <div className="text-center lg:text-left">
                        <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
                            Contact Us <br className="hidden lg:block" /> <br className="hidden lg:block" />
                           
                        </h2>
                        <p>for support or partnerships</p>
                    </div>

                    <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
                        <div className="pb-6">
                            <h3 className="font-medium">Email</h3>
                            <p className="text-muted-foreground mt-4">info@novationapp.com</p>

                            <ol className="list-outside list-decimal space-y-2 pl-4">
                                <li className="text-muted-foreground mt-4">To request a refund, please contact our support team with your order number and reason for the refund.</li>
                                <li className="text-muted-foreground mt-4">Refunds will be processed within 3-5 business days.</li>
                                <li className="text-muted-foreground mt-4">Please note that refunds are only available for new customers and are limited to one per customer.</li>
                            </ol>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Phone</h3>
                            <p className="text-muted-foreground mt-4">You can cancel your subscription at any time by logging into your account and clicking on the cancel button.</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Linkedin</h3>
                            <p className="text-muted-foreground my-4">Yes, you can upgrade your plan at any time by logging into your account and selecting the plan you want to upgrade to.</p>
                            <ul className="list-outside list-disc space-y-2 pl-4">
                                <li className="text-muted-foreground">You will be charged the difference in price between your current plan and the plan you are upgrading to.</li>
                                <li className="text-muted-foreground">Your new plan will take effect immediately and you will be billed at the new rate on your next billing cycle.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
