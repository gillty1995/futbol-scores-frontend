import { useState, useCallback } from "react";

function useFormState(initialState) {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setError("");
  }, [initialState]);

  return {
    formData,
    error,
    handleChange,
    setError,
    resetForm,
  };
}

export default useFormState;
