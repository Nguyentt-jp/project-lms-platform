import Navbar from "./_components/navbar";

export default function PublicLayout({children}:{children: React.ReactNode}){
    return(
        <div className="">
            <Navbar/>
            <div className="flex flex-col items-center text-center">
                <main className="container mx-4 px-4 md:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}