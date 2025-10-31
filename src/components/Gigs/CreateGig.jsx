import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const CreateGig = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    searchTags: [],
    images: [],
    pricing: {
      basic: {
        title: "",
        description: "",
        price: 0,
        deliveryTime: 1,
        revisions: 1,
      },
    },
  });

  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { value: "web-development", label: "Web Development" },
    { value: "graphic-design", label: "Graphic Design" },
    { value: "digital-marketing", label: "Digital Marketing" },
    { value: "writing-translation", label: "Writing & Translation" },
    { value: "mobile-development", label: "Mobile Development" },
    { value: "video-animation", label: "Video & Animation" },
    { value: "music-audio", label: "Music & Audio" },
    { value: "programming-tech", label: "Programming & Tech" },
  ];

  // ✅ Safe JSON parser (prevents “Unexpected token” error)
  const safeJsonParse = async (response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      return { message: text }; // fallback for HTML or text errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.pricing.basic.title ||
      !formData.pricing.basic.description
    ) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/api/gigs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          pricing: {
            basic: {
              ...formData.pricing.basic,
              price: Number(formData.pricing.basic.price),
              deliveryTime: Number(formData.pricing.basic.deliveryTime),
              revisions: Number(formData.pricing.basic.revisions),
            },
          },
          userId: user?._id,
        }),
      });

      const data = await safeJsonParse(response);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create gig");
      }

      navigate("/my-gigs");
    } catch (error) {
      console.error("❌ Gig creation failed:", error);
      setError(error instanceof Error ? error.message : "Failed to create gig");
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.searchTags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        searchTags: [...prev.searchTags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      searchTags: prev.searchTags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addImage = () => {
    const imageUrl = prompt("Enter image URL:");
    if (imageUrl) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (user?.role !== "freelancer") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only freelancers can create gigs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Gig</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* --- BASIC INFO SECTION --- */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gig Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="I will create a professional website for your business"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subcategory}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subcategory: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="WordPress, React, Logo Design, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what you will deliver and what makes your service special..."
                />
              </div>
            </div>

            {/* --- TAGS SECTION --- */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Tags</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.searchTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.searchTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* --- IMAGES SECTION --- */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Images</h2>
              <button
                type="button"
                onClick={addImage}
                className="flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-600" />
                <span>Add Image URL</span>
              </button>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Gig image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* --- PRICING SECTION --- */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Pricing</h2>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Basic Package
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pricing.basic.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pricing: {
                            ...prev.pricing,
                            basic: {
                              ...prev.pricing.basic,
                              title: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Basic Website"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min="5"
                      value={formData.pricing.basic.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pricing: {
                            ...prev.pricing,
                            basic: {
                              ...prev.pricing.basic,
                              price: Number(e.target.value),
                            },
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="25"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Time (days) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.pricing.basic.deliveryTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pricing: {
                            ...prev.pricing,
                            basic: {
                              ...prev.pricing.basic,
                              deliveryTime: Number(e.target.value),
                            },
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Revisions *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.pricing.basic.revisions}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pricing: {
                            ...prev.pricing,
                            basic: {
                              ...prev.pricing.basic,
                              revisions: Number(e.target.value),
                            },
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.pricing.basic.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pricing: {
                          ...prev.pricing,
                          basic: {
                            ...prev.pricing.basic,
                            description: e.target.value,
                          },
                        },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What's included in this package..."
                  />
                </div>
              </div>
            </div>

            {/* --- SUBMIT BUTTONS --- */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/my-gigs")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Creating..." : "Create Gig"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Upload, X, Plus } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

// export const CreateGig = () => {
//   const { user, token } = useAuth();
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     subcategory: '',
//     searchTags: [],
//     images: [],
//     pricing: {
//       basic: {
//         title: '',
//         description: '',
//         price: 0,
//         deliveryTime: 1,
//         revisions: 1
//       }
//     }
//   });
  
//   const [currentTag, setCurrentTag] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const categories = [
//     { value: 'web-development', label: 'Web Development' },
//     { value: 'graphic-design', label: 'Graphic Design' },
//     { value: 'digital-marketing', label: 'Digital Marketing' },
//     { value: 'writing-translation', label: 'Writing & Translation' },
//     { value: 'mobile-development', label: 'Mobile Development' },
//     { value: 'video-animation', label: 'Video & Animation' },
//     { value: 'music-audio', label: 'Music & Audio' },
//     { value: 'programming-tech', label: 'Programming & Tech' }
//   ];

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     if (!formData.title || !formData.description || !formData.category || 
//       !formData.pricing.basic.title || !formData.pricing.basic.description) {
//     setError('Please fill all required fields');
//     setLoading(false);
//     return;
//   }


//     try {
//       const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/api/gigs`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           ...formData,
//            pricing: {
//               basic: {
//                   ...formData.pricing.basic,
//                   price: Number(formData.pricing.basic.price),
//                   deliveryTime: Number(formData.pricing.basic.deliveryTime),
//                   revisions: Number(formData.pricing.basic.revisions)
//                 }
//               },
//               userId: user?._id
//           })
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         // const errorData = await response.json();
//         throw new Error(data.message || 'Failed to create gig');
//       }

//       navigate('/my-gigs');
//     } catch (error) {
//       // console.log('Creation error', error);
//       setError(error instanceof Error ? error.message : 'Failed to create gig');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addTag = () => {
//     if (currentTag.trim() && !formData.searchTags.includes(currentTag.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         searchTags: [...prev.searchTags, currentTag.trim()]
//       }));
//       setCurrentTag('');
//     }
//   };

//   const removeTag = (tagToRemove) => {
//     setFormData(prev => ({
//       ...prev,
//       searchTags: prev.searchTags.filter(tag => tag !== tagToRemove)
//     }));
//   };

//   const addImage = () => {
//     const imageUrl = prompt('Enter image URL:');
//     if (imageUrl) {
//       setFormData(prev => ({
//         ...prev,
//         images: [...prev.images, imageUrl]
//       }));
//     }
//   };

//   const removeImage = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   if (user?.role !== 'freelancer') {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
//           <p className="text-gray-600">Only freelancers can create gigs.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Gig</h1>
          
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Basic Information */}
//             <div className="space-y-6">
//               <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Gig Title *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.title}
//                   onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="I will create a professional website for your business"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Category *
//                 </label>
//                 <select
//                   required
//                   value={formData.category}
//                   onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map(category => (
//                     <option key={category.value} value={category.value}>
//                       {category.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Subcategory *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.subcategory}
//                   onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="WordPress, React, Logo Design, etc."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Description *
//                 </label>
//                 <textarea
//                   required
//                   rows={6}
//                   value={formData.description}
//                   onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Describe what you will deliver and what makes your service special..."
//                 />
//               </div>
//             </div>

//             {/* Tags */}
//             <div className="space-y-4">
//               <h2 className="text-xl font-semibold text-gray-900">Tags</h2>
              
//               <div className="flex space-x-2">
//                 <input
//                   type="text"
//                   value={currentTag}
//                   onChange={(e) => setCurrentTag(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Add a tag"
//                 />
//                 <button
//                   type="button"
//                   onClick={addTag}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                   <Plus className="w-4 h-4" />
//                 </button>
//               </div>
              
//               {formData.searchTags.length > 0 && (
//                 <div className="flex flex-wrap gap-2">
//                   {formData.searchTags.map((tag) => (
//                     <span
//                       key={tag}
//                       className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
//                     >
//                       {tag}
//                       <button
//                         type="button"
//                         onClick={() => removeTag(tag)}
//                         className="ml-2 text-blue-600 hover:text-blue-800"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Images */}
//             <div className="space-y-4">
//               <h2 className="text-xl font-semibold text-gray-900">Images</h2>
              
//               <button
//                 type="button"
//                 onClick={addImage}
//                 className="flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors"
//               >
//                 <Upload className="w-5 h-5 text-gray-600" />
//                 <span>Add Image URL</span>
//               </button>
              
//               {formData.images.length > 0 && (
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {formData.images.map((image, index) => (
//                     <div key={index} className="relative">
//                       <img
//                         src={image}
//                         alt={`Gig image ${index + 1}`}
//                         className="w-full h-24 object-cover rounded-md"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeImage(index)}
//                         className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Pricing */}
//             <div className="space-y-6">
//               <h2 className="text-xl font-semibold text-gray-900">Pricing</h2>
              
//               <div className="border border-gray-200 rounded-lg p-6">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Package</h3>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Package Title *
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={formData.pricing.basic.title}
//                       onChange={(e) => setFormData(prev => ({
//                         ...prev,
//                         pricing: {
//                           ...prev.pricing,
//                           basic: {
//                             ...prev.pricing.basic,
//                             title: e.target.value
//                           }
//                         }
//                       }))}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Basic Website"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Price ($) *
//                     </label>
//                     <input
//                       type="number"
//                       required
//                       min="5"
//                       value={formData.pricing.basic.price}
//                       onChange={(e) => setFormData(prev => ({
//                         ...prev,
//                         pricing: {
//                           ...prev.pricing,
//                           basic: {
//                             ...prev.pricing.basic,
//                             price: Number(e.target.value)
//                           }
//                         }
//                       }))}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="25"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Delivery Time (days) *
//                     </label>
//                     <input
//                       type="number"
//                       required
//                       min="1"
//                       value={formData.pricing.basic.deliveryTime}
//                       onChange={(e) => setFormData(prev => ({
//                         ...prev,
//                         pricing: {
//                           ...prev.pricing,
//                           basic: {
//                             ...prev.pricing.basic,
//                             deliveryTime: Number(e.target.value)
//                           }
//                         }
//                       }))}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="3"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Revisions *
//                     </label>
//                     <input
//                       type="number"
//                       required
//                       min="0"
//                       value={formData.pricing.basic.revisions}
//                       onChange={(e) => setFormData(prev => ({
//                         ...prev,
//                         pricing: {
//                           ...prev.pricing,
//                           basic: {
//                             ...prev.pricing.basic,
//                             revisions: Number(e.target.value)
//                           }
//                         }
//                       }))}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="2"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Package Description *
//                   </label>
//                   <textarea
//                     required
//                     rows={3}
//                     value={formData.pricing.basic.description}
//                     onChange={(e) => setFormData(prev => ({
//                       ...prev,
//                       pricing: {
//                         ...prev.pricing,
//                         basic: {
//                           ...prev.pricing.basic,
//                           description: e.target.value
//                         }
//                       }
//                     }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="What's included in this package..."
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Submit */}
//             <div className="flex justify-end space-x-4">
//               <button
//                 type="button"
//                 onClick={() => navigate('/my-gigs')}
//                 className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 {loading ? 'Creating...' : 'Create Gig'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };