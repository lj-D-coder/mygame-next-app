import TicketForm from "@/app/(components)/TicketForm";

const getTicketByID = async (id) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/Tickets/${id}`, {
    cache: "no-cache",
  });
  if (!res.ok) {
    throw new Error("Failed to get ticket.");
  }
  return res.json();
};

const TicketPage = async ({ params }) => {
  const EDITMODE = params.id === "new" ? false : true;
  let updateTicketData = {};
  if (EDITMODE) {
    updateTicketData = await getTicketByID(params.id);
    updateTicketData = updateTicketData.foundTicket;
  } else { 
    updateTicketData = {
      _id: "new"
    }
  }

  return <TicketForm ticket={updateTicketData } />
  
}

export default TicketPage