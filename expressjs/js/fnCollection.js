/* eslint-disable no-unused-vars */
const deleteAsync = async (btn) => {
  const parent = btn.parentElement;
  const productId = parent.querySelector('input[name="productId"]').value;
  const csrfToken = parent.querySelector('input[name="_csrf"]').value;

  try {
    const response = await fetch("/api/product/delete/" + productId, {
      method: "DELETE",
      headers: {
        "csrf-token": csrfToken,
      },
    });

    const json = await response.json();

    if (response.ok) {
      const form = document.getElementById("product-edit-form");
      form.classList.add("hidden");

      const deleteInfo = document.getElementById("product-deleted");
      deleteInfo.classList.remove("hidden");
    }
  } catch (err) {
    console.error("Error deleting product:", err);
  }
};
