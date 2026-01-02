import workSyncLogo from "../../assets/Logo.png";

const CompanyInfoSettings = () => {
  return (
    <main className="flex-1 p-6 bg-gray-100">
      <div className="flex-1 p-6 bg-gray-50  rounded-xl shadow overflow-hidden">
        <h2 className="text-lg font-semibold">Company System Information</h2>
        {/* Center Logo Card */}
        <div className="flex justify-center mb-6">
          <div className="w-48 h-40 bg-gray-100 rounded-xl shadow-md flex flex-col items-center justify-center">
            <img
              src={workSyncLogo}
              alt="WorkingSync Logo"
              className="w-20 h-20 object-contain mb-2"
            />
            <span className="text-teal-600 font-semibold">WorkSync</span>
          </div>
        </div>

        {/* Company Info Table */}
        <div className="max-w-xl mx-auto bg-gray-100 rounded-xl shadow overflow-hidden">
          <div className="bg-[#087990] text-white px-4 py-2 font-medium">
            Company Name : <span className="font-normal">WorkSync</span>
          </div>

          <div className="divide-y">
            <div className="flex px-4 py-2">
              <span className="w-40 text-gray-600">Address</span>
              <span className="text-gray-800">
                : 123 Main Street, Colombo, Sri Lanka
              </span>
            </div>

            <div className="flex px-4 py-2">
              <span className="w-40 text-gray-600">Email</span>
              <span className="text-gray-800">: info@worksync.com</span>
            </div>

            <div className="flex px-4 py-2">
              <span className="w-40 text-gray-600">Contact Number</span>
              <span className="text-gray-800">: 07XXXXXXXX</span>
            </div>

            <div className="flex px-4 py-2">
              <span className="w-40 text-gray-600">Website</span>
              <span className="text-gray-800">: www.worksync.com</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CompanyInfoSettings;
