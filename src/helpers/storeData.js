import PolicyCarrierModel from "../models/policyCarrier.js";
import PolicyCategoryModel from "../models/policyCategory.js";
import PolicyInfoModel from "../models/policyInfo.js";
import UserModel from "../models/user.js";
import UserAccountModel from "../models/userAccount.js";

export const storeInSchema = async ({ data }) => {
  try {
    let responseObj = {};
    if (data?.userArray) {
      const savedUsers = await saveUserData(data?.userArray);
      responseObj.savedUsers = savedUsers;
      if (savedUsers.length > 0) {
        const savedUserAccount = await saveUserAccountData({
          userData: savedUsers,
          userAccountData: data?.userAccountArray,
        });
        responseObj.savedUserAccounts = savedUserAccount;
      } else {
        responseObj.savedUserAccounts = { message: "No new data to update" };
      }
    }

    if (data?.policyInfoArray) {
      const savedPolicyCarrier = await savePolicyCarrier(
        data?.policyCarrierArray
      );
      responseObj.savedPolicyCarrier = savedPolicyCarrier;

      const savedPolicyCategory = await savePolicyCategory(
        data?.policyCategoryArray
      );
      responseObj.savedPolicyCategory = savedPolicyCategory;

      const savedPolicyInfo = await savePolicyInfo({
        policyCarrierData: savedPolicyCarrier,
        policyCategoryData: savedPolicyCategory,
        policyInfoData: data?.policyInfoArray,
      });
      responseObj.savedPolicyInfo = savedPolicyInfo;
    }

    return responseObj;
  } catch (error) {
    return { error: error.message };
  }
};

const saveUserData = async (userData) => {
  try {
    const existingData = await UserModel.find();
    const newData = userData.filter(
      (user) => !existingData.some((data) => data.email === user.email)
    );

    if (newData.length === 0) {
      return { message: "No new data to update" };
    }

    const savedUsers = await UserModel.insertMany(newData);
    return savedUsers;
  } catch (error) {
    return error;
  }
};

const saveUserAccountData = async ({ userData, userAccountData }) => {
  try {
    // Map user accounts with corresponding user IDs
    const modifiedUserAccountsData = userData.map((savedUser, index) => ({
      ...userAccountData[index],
      userId: savedUser._id,
    }));

    const existingData = await UserAccountModel.find();

    // Filter out already existing user accounts
    const newData = validAccountsData.filter(
      (accountData) =>
        !existingData.some((data) => data.userId.equals(accountData.userId))
    );

    if (newData.length === 0) {
      return { message: "No new data to update" };
    }

    const savedUserAccounts = await UserAccountModel.insertMany(newData);
    return savedUserAccounts;
  } catch (error) {
    return error;
  }
};

const savePolicyCarrier = async (policyCarrierData) => {
  try {
    let newData = policyCarrierData;
    // Filter out already existing Policy Carriers
    const existingData = await PolicyCarrierModel.find();

    if (existingData?.length > 0) {
      newData = policyCarrierData.filter(
        (carrierData) =>
          !existingData.some((data) =>
            data.companyName.equals(carrierData.companyName)
          )
      );
    }

    if (newData?.length === 0) {
      return { message: "No new data to update" };
    }

    const savedPolicyCarriers = await PolicyCarrierModel.insertMany(newData);
    return savedPolicyCarriers;
  } catch (error) {
    return error;
  }
};

const savePolicyCategory = async (policyCategoryData) => {
  try {
    let newData = policyCategoryData;
    // Filter out already existing Policy Category
    const existingData = await PolicyCategoryModel.find();

    if (existingData?.length > 0) {
      newData = policyCategoryData.filter(
        (categoryData) =>
          !existingData.some((data) =>
            data.categoryName.equals(categoryData.categoryName)
          )
      );
    }

    if (newData?.length === 0) {
      return { message: "No new data to update" };
    }

    const savedPolicyCategory = await PolicyCategoryModel.insertMany(newData);
    return savedPolicyCategory;
  } catch (error) {
    return error;
  }
};

const savePolicyInfo = async ({
  policyCategoryData,
  policyCarrierData,
  policyInfoData,
}) => {
  try {
    const userData = await UserModel.find();
    // Map plocy info with corresponding policy carrier, category and user IDs
    const modifiedPolicyInfoData = policyInfoData.map((policy, index) => {
      const policyCarrier = policyCarrierData.filter(
        (carrier) => carrier.companyName === policy.carrier
      );
      const policyCategory = policyCategoryData.filter(
        (category) => category.categoryName === policy.category
      );
      return {
        ...policy,
        userId: userData[index]?._id,
        policyCarrier: policyCarrier[0]?._id,
        policyCategory: policyCategory[0]?._id,
      };
    });

    const existingData = await PolicyInfoModel.find();

    let newData = modifiedPolicyInfoData;
    // Filter out already existing policy infos
    if (existingData?.length > 0) {
      newData = modifiedPolicyInfoData.filter(
        (infoData) =>
          !existingData.some((data) => data.userId.equals(infoData.userId))
      );
    }

    if (newData?.length === 0) {
      return { message: "No new data to update" };
    }

    const savedPolicy = await PolicyInfoModel.insertMany(newData);
    return savedPolicy;
  } catch (error) {
    return error;
  }
};
