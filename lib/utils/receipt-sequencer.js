import Receipt from "@/app/(models)/ReceiptModel";

async function getNextSequence(sequenceName) {
    var sequenceDocument = await Receipt.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { receiptNo: 1 } },
      { new: true, upsert: true }
    );
  
    return sequenceDocument.receiptNo;
  }
  
  

export default getNextSequence;