import axios from "axios";
import { useEffect, useState } from "react";
import UploadModal from "./UploadModal";


const DocumentsTab = ({projectId}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const URL_API = "http://localhost:8090";

  const fetchDocuments =async ()=>{
    try {
      const res = await axios.get(
        `${URL_API}/api/v1/projects/${projectId}/attachments`,
        {withCredentials:true}
      );
      setDocuments(res.data.data ||[]);
      console.log("Fetched attachments:", res.data.data);
    } catch (error) {
      console.error("Failed to fetch documents", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if (!projectId) return;
    setLoading(true);
    fetchDocuments();
  },[projectId]);

  const filteredDocs = documents.filter(doc =>
    filterType === "All" ? true: doc.originalName.toLowerCase().endsWith(filterType.toLowerCase())
    );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold ml-6">Project Documents</h2>

        <div className="flex items-center gap-3 mr-6">
         
          <select 
            value={filterType}
            onChange={(e)=> setFilterType(e.target.value)}
            className="flex items-center justify-between w-28 px-3 py-2 border rounded-md bg-white text-gray-700 text-sm">
            <option value="All">All</option>
            <option value="pdf">PDF</option>
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="txt">TXT</option>
          </select>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-5 py-2 rounded-md bg-[#087990] text-white text-sm hover:bg-teal-800"
          >
            Upload File
          </button>
        </div>
      </div>

      {/* documents grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl m-6">
      {loading && <p className="m-6 text-gray-500 col-span-2">Loading documents...</p>}
      {!loading && filteredDocs.length === 0 && (
          <p className="m-6 text-gray-500 col-span-2">No documents found.</p>
      )}
        {!loading && filteredDocs.length > 0 &&
        filteredDocs.map((doc) => (
          <div
            key={doc._id}
            className="bg-white border rounded-md shadow-sm text-sm text-gray-700"
          >
            <div className="border-b px-4 py-2 font-semibold">Details</div>
            <div className="px-4 py-3 space-y-1">
              <p>
                <span className="font-medium">Title :</span> {doc.originalName}
              </p>
              <p>
                <span className="font-medium">Uploaded On:</span>{" "}
                {new Date(doc.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">File Type:</span>{" "}
                {doc.fileType}
              </p>
              <p>
                <span className="font-medium">File Size:</span>{" "}
                {(doc.fileSize/1024).toFixed(2)} KB
              </p>
            </div>
            <div className="px-4 py-3 border-t flex justify-end">
              <button className="px-4 py-1 rounded-md bg-[#087990] text-white text-sm hover:bg-teal-800">
                <a href={`${URL_API}${doc.fileUrl}`} download={doc.originalName}>
                Download
                </a></button>
            </div>
          </div>
        ))}
      </div>

      {/* upload modal */}
      {isUploadOpen && (
        <UploadModal
        projectId = {projectId}
        onClose={() => setIsUploadOpen(false)} 
        onUploadSuccess={fetchDocuments}
        />
      )}
    </>
  );
};

export default DocumentsTab;
