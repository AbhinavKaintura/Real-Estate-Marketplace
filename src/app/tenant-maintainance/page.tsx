import React from "react";
import MaintenanceRequestForm from "@/components/tenant/maintainance-form/page";
import { div } from "framer-motion/client";

const TenantForm: React.FC = () => {
    return (
        <div>
            <MaintenanceRequestForm tenantId="123" />
        </div>
    )
};

export default TenantForm;