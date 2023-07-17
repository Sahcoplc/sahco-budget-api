import { model, Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const schema = new Schema(
    {
        account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
        status: { type: String, enum: ["PENDING", "APPROVED", "DECLINED", "SUSPENDED"], default: "PENDING", required: true },
        january: { type: Number },
        february: { type: Number },
        march: { type: Number },
        april: { type: Number },
        may: { type: Number },
        june: { type: Number },
        july: { type: Number },
        august: { type: Number },
        sept: { type: Number },
        october: { type: Number },
        nov: { type: Number },
        december: { type: Number },
        estimatedBudget: { type: Number },
        actualBudget: { type: Number },
        deptApprover: { id: String, name: String },
        auditApprover: { id: String, name: String },
        mgtApprover: { id: String, name: String },
        operator: { id: String, name: String },
        department: { id: String, name: String },
    },
    { timestamps: true }
)

schema.plugin(paginator);
schema.plugin(mongooseAggregatePaginate);
export default model("Budget", schema);