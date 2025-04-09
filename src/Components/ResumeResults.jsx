// import './ResumeResult.css'


import React, { useState } from "react";
import './ResumeResult.css';

const ResumeResults = ({ results }) => {
  const [active, setActive] = useState(null);

  return (
    <div className="mt-8 w-full mx-auto resumeresult">
      <div className="flex justify-center items-center heading mb-6">
        <h3 className="text-2xl font-semibold">Resume Selection Results</h3>
      </div>

      {results.map((result, index) => (
        <div key={index} className="mb-4  rounded-lg overflow-hidden shadow-md">
          {/* Main candidate info div */}
          <div className="p-4 w-full   pro1">
            <div className="flex flex-wrap justify-between items-center gap-2 w-full max-w-lg mx-auto">
              <div className="w-full md:w-[450px] p-4 border-1 rounded-lg flex flex-col gap-3 shadow-lg resultdiv">
                <div>
                  <div className="space-y-1 flex flex-col gap-2">
                    <h4 className="text-lg font-bold">{result?.name}</h4>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      <span className={`px-2 py-1 rounded-full text-black text-xs status1 ${
                        result?.resume_selection_result?.resume_selection_status === "Selected" 
                          ? "bg-green-500" 
                          : result?.resume_selection_result?.resume_selection_status === "Rejected" 
                            ? "bg-red-500" 
                            : "bg-yellow-500"
                      }`}>
                        {result?.resume_selection_result?.resume_selection_status}
                      </span>
                    </p>
                    <p className="text-sm"><span className="font-medium">Resume ID:</span> {result.resume_id}</p>
                    <p className="text-sm"><span className="font-medium">Email:</span> {result.resume_selection_result?.candidate_info?.email}</p>
                    <p className="text-sm"><span className="font-medium">Phone:</span> {result.resume_selection_result?.candidate_info?.phone}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setActive(active === index ? null : index)}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300 w-[120px] shadow-2xl cursor-pointer py-1"
                >
                  {active === index ? "Hide Details" : "Show Details"}
                </button>
              </div>
            </div>
          </div>

          {/* Details section with improved grid layout */}
          {active === index && (
            <div className="p-0 md:p-2 bg-white details-container">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mx-auto details-container2">
                {/* Scoring section */}
                <div className="w-full bg-white p-3 rounded-lg shadow-sm scoring border-1 weakness1">
                  <h5 className="font-semibold mb-3 text-blue-800 border-b pb-2">Scoring</h5>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Overall Score</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${result?.resume_selection_result?.overall_score}%` }}></div>
                      </div>
                      <p className="text-xs text-right">{result?.resume_selection_result?.overall_score}%</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Relevance Score</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${result?.resume_selection_result?.relevance_score}%` }}></div>
                      </div>
                      <p className="text-xs text-right">{result?.resume_selection_result?.relevance_score}%</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Cultural Fit Score</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${result?.resume_selection_result?.cultural_fit_score}%` }}></div>
                      </div>
                      <p className="text-xs text-right">{result?.resume_selection_result?.cultural_fit_score}%</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Skills Fit Score</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${result?.resume_selection_result?.skills_fit_score}%` }}></div>
                      </div>
                      <p className="text-xs text-right">{result?.resume_selection_result?.skills_fit_score}%</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Experience Match Score</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${result?.resume_selection_result?.experience_match_score}%` }}></div>
                      </div>
                      <p className="text-xs text-right">{result?.resume_selection_result?.experience_match_score}%</p>
                    </div>
                  </div>
                </div>
                
                {/* Questions section */}
                {result.resume_selection_result?.questions?.generated_questions?.all_questions && (
                  <div className="w-full bg-white p-3 rounded-lg shadow-sm border-1 weakness1 ">
                    <h5 className="font-semibold mb-3 text-blue-800 border-b pb-2">Suggested Interview Questions</h5>
                    <ol className="list-decimal list-inside space-y-2 pl-1 question">
                      {result.resume_selection_result.questions.generated_questions.all_questions.Qustion1 && 
                        <li className="text-sm questionlist">{result.resume_selection_result.questions.generated_questions.all_questions.Qustion1}</li>}
                      {result.resume_selection_result.questions.generated_questions.all_questions.Qustion2 && 
                        <li className="text-sm questionlist">{result.resume_selection_result.questions.generated_questions.all_questions.Qustion2}</li>}
                      {result.resume_selection_result.questions.generated_questions.all_questions.Qustion3 && 
                        <li className="text-sm questionlist">{result.resume_selection_result.questions.generated_questions.all_questions.Qustion3}</li>}
                      {result.resume_selection_result.questions.generated_questions.all_questions.Qustion4 && 
                        <li className="text-sm questionlist">{result.resume_selection_result.questions.generated_questions.all_questions.Qustion4}</li>}
                      {result.resume_selection_result.questions.generated_questions.all_questions.Qustion5 && 
                        <li className="text-sm questionlist">{result.resume_selection_result.questions.generated_questions.all_questions.Qustion5}</li>}
                    </ol>
                  </div>
                )}
                
                {/* Strengths section */}
                {result.resume_selection_result?.strengths && result.resume_selection_result.strengths.length > 0 && (
                  <div className="w-full bg-green-50 p-3 rounded-lg shadow-sm border-1 weakness1">
                    <h5 className="font-semibold mb-2 text-green-700 border-b border-green-200 pb-2">Strengths</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {result.resume_selection_result.strengths.map((strength, idx) => (
                        <li key={idx} className="text-gray-700 questionlist">{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Weaknesses section */}
                {result.resume_selection_result?.weaknesses && result.resume_selection_result.weaknesses.length > 0 && (
                  <div className="w-full bg-red-50 p-3 rounded-lg shadow-sm border-1 weakness1">
                    <h5 className="font-semibold mb-2 text-red-700 border-b border-red-200 pb-2">Weaknesses</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {result.resume_selection_result.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="text-gray-700 questionlist">{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Recommendations section */}
                {result.resume_selection_result?.recommendations && result.resume_selection_result.recommendations.length > 0 && (
                  <div className="w-full bg-blue-50 p-3 rounded-lg shadow-sm border-1 weakness1">
                    <h5 className="font-semibold mb-2 text-blue-700 border-b border-blue-200 pb-2">Recommendations</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {result.resume_selection_result.recommendations.map((recommendation, idx) => (
                        <li key={idx} className="text-gray-700 questionlist " >{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Missing Elements section */}
                {result.resume_selection_result?.missing_elements && result.resume_selection_result.missing_elements.length > 0 && (
                  <div className="w-full bg-yellow-50 p-3 rounded-lg shadow-sm border-1 weakness1">
                    <h5 className="font-semibold mb-2 text-yellow-700 border-b border-yellow-200 pb-2">Missing Elements</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {result.resume_selection_result.missing_elements.map((missing, idx) => (
                        <li key={idx} className="text-gray-700 questionlist">{missing}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResumeResults;