import React, { useEffect, useState } from "react";
import {
  IoArrowBack,
  IoCheckmark,
  IoCloudUploadOutline,
} from "react-icons/io5";
import { FiEdit2 } from "react-icons/fi";
import { onValue, ref, remove, set, update } from "firebase/database";
import { db } from "../../../Database/FirebaseConfig";
import { auth } from "../../../Database/FirebaseConfig";

const EditProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Mahmudul Hasan");
  const [userData, setUserData] = useState({});
  const [profileImgUrl, setProfileImgUrl] = useState(
    auth.currentUser.profile_picture
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (auth.currentUser?.uid) {
      const UserRef = ref(db, "users/");
      onValue(UserRef, (snapshot) => {
        let obj = {};
        snapshot.forEach((item) => {
          if (auth.currentUser.uid === item.val().userid) {
            obj = { ...item.val(), userKey: item.key };
          }
        });
        setUserData(obj);
      });
    }
  }, []);

  const handleProfilePic = () => {
    if (window.cloudinary) {
      cloudinary.openUploadWidget(
        {
          cloudName: "dubcsgtfg",
          uploadPreset: "taskflow",
          googleApiKey: "AIzaSyBj7HACYr7i1dWgC81FalKEwMuPXarS3rk",
          searchBySites: ["all", "cloudinary.com"],
          searchByRights: true,
          sources: [
            "local",
            "url",
            "camera",
            "image_search",
            "dropbox",
            "image_search",
            "shutterstock",
            "unsplash",
          ],
        },
        (error, result) => {
          if (error) {
            throw new Error("cloudinary profile picture upload error");
          }
          if (result.info.secure_url) {
            const url = result.info.secure_url;

            update(ref(db, `users/${auth.currentUser.uid}`), {
              profile_picture: url,
            });
          }
        }
      );
    } else {
      throw new Error("upload failed");
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Save logic here
    }
    setIsEditing(!isEditing);
  };
  console.log(userData?.profile_picture);

  return (
    <div className="w-full h-screen bg-gradient-to-t from-red-100 via-red-50 to-white flex justify-center items-center px-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10 md:p-14 flex flex-col items-center text-center">
        {/* Back Button */}
        <button className="absolute top-6 left-6 text-gray-700 text-2xl">
          <IoArrowBack />
        </button>

        {/* Profile Image */}
        <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6 group">
          <picture>
            <img
              src={
                userData?.profile_picture ||
                "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D"
              }
              alt="profilePic"
              className="w-full h-full object-cover rounded-full"
            />
          </picture>
          <span
            onClick={handleProfilePic}
            className="absolute cursor-pointer hidden group-hover:block top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl"
          >
            <IoCloudUploadOutline />
          </span>
        </div>

        {/* Name with Edit */}
        <div className="flex items-center gap-2 mb-2">
          {isEditing ? (
            <input
              type="text"
              value={auth.currentUser?.userName}
              onChange={(e) => setName(e.target.value)}
              className="text-2xl md:text-3xl font-bold text-center border-b border-gray-400 focus:outline-none"
            />
          ) : (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {name}
            </h2>
          )}
          <button
            onClick={toggleEdit}
            className="text-gray-600 text-lg hover:text-gray-900"
          >
            {isEditing ? <IoCheckmark /> : <FiEdit2 />}
          </button>
        </div>

        {/* Email */}
        <p className="text-lg text-gray-600 mb-6">{auth.currentUser?.email}</p>

        {/* Handle */}
        <p className="text-sm text-gray-500">@TaskFlow</p>
      </div>
    </div>
  );
};

export default EditProfileCard;
