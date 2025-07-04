import React from "react";

const DataDeletion = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Data Deletion Instructions</h1>
        <p className="mb-4">
          We respect your privacy and are committed to protecting your personal data. If you wish to delete your account and all associated data from our platform, please follow the instructions below.
        </p>
        <ol className="list-decimal list-inside mb-4 space-y-2">
          <li>
            Send an email to{" "}
            <a href="mailto:support@alivoro.com" className="text-purple-600 underline">
              support@alivoro.com
            </a>{" "}
            with the subject line <strong>“Data Deletion Request”</strong>.
          </li>
          <li>
            In the email, please include your account email address and clearly state that you wish to delete your account and all associated data.
          </li>
          <li>
            Our team will process your request within 3-5 business days and confirm once your data has been deleted.
          </li>
        </ol>
        <p>
          If you have any questions, feel free to contact us at the email above.
        </p>
      </div>
    </div>
  );
};

export default DataDeletion;
