import CreateTaskForm from "@/components/shared/CreateTaskForm";
import Image from "next/image";
import Nav from "@/components/shared/Nav";

export default function Home() {
   

  return (
    <main className=" min-h-screen ">
      <Nav/>
        <CreateTaskForm/>
      

      
    </main>
  );
}
