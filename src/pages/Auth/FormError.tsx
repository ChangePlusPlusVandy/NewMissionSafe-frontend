import React from "react";

export const FormError: React.FC<{ children: string | undefined }> = ({
  children,
}) => <p style={{ color: "red" }}>{children}</p>;

export default FormError;
