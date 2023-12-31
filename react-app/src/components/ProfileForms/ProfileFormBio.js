import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserInfoThunk } from "../../store/users";

function ProfileFormBio() {
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const [biography, setBiography] = useState(
    user.biography ? user.biography : ""
  );
  const [errors, setErrors] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newBio = {
      biography: biography,
    };
    let formType = "bio";
    // console.log("userInfoProp", user.id);
    const data = await dispatch(updateUserInfoThunk(newBio, user.id, formType));
    if (data) {
      setErrors(data);
      // console.log("errors set");
    }
    
  };

  return (
    <div className="bio-form-wrapper">
      {errors}
      <form onSubmit={handleSubmit} className="bio-form">
        <textarea
          className="form-form-input"
          type="textarea"
          value={biography}
          maxLength={500}
          onChange={(e) => setBiography(e.target.value)}
          defaultValue={user.biography}
        />
        <button type="submit" className="profile-form-submit">
          Save
        </button>
      </form>
    </div>
  );
}

export default ProfileFormBio;
