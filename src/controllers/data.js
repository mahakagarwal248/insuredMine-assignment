import csvtojson from "csvtojson";
import { runWorker } from "../helpers/worker.js";
import PolicyInfoModel from "../models/policyInfo.js";

export const saveData = async (req, res) => {
  const filePath = req.file.path;
  try {
    const jsonArray = await csvtojson()
      .fromFile(filePath)
      .then((jsonObj) => {
        return jsonObj;
      });

    const dataObj = {
      userArray: [],
      userAccountArray: [],
    };

    const policyDataObj = {
      policyCategoryArray: [],
      policyCarrierArray: [],
      policyInfoArray: [],
    };

    let policyCategorySet = new Set();
    let policyCarrierSet = new Set();

    for (var y in jsonArray) {
      const obj = jsonArray[y];
      const userObj = {
        name: obj.firstname,
        dob: obj.dob,
        address: obj.address,
        phoneNumber: obj.phone,
        state: obj.state,
        zipCode: obj.zip,
        email: obj.email,
        gender: obj.gender,
      };
      dataObj.userArray.push(userObj);
      dataObj.userAccountArray.push({
        accountName: obj.account_name,
        accountType: obj.account_type,
      });
      policyDataObj.policyInfoArray.push({
        policyNumber: obj.policy_number,
        startDate: obj.policy_start_date,
        endDate: obj.policy_end_date,
        category: obj.category_name,
        carrier: obj.company_name,
      });

      policyCategorySet.add(obj.category_name);
      policyCarrierSet.add(obj.company_name);
    }

    policyDataObj.policyCategoryArray = Array.from(policyCategorySet).map(
      (category) => ({
        categoryName: category,
      })
    );
    policyDataObj.policyCarrierArray = Array.from(policyCarrierSet).map(
      (carrier) => ({
        companyName: carrier,
      })
    );
    const response = await runWorker(dataObj);
    const policyResponse = await runWorker(policyDataObj);
    const responseData = {
      ...response,
      ...policyResponse,
    };
    return res.status(200).json({
      message: "All columns have been processed and stored.",
      data: responseData,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getPolicyData = async (req, res) => {
  try {
    const { username } = req.query;
    const policyData = await PolicyInfoModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $match: {
          "userInfo.name": username,
        },
      },
      {
        $project: {
          _id: 1,
          policyNumber: 1,
          startDate: 1,
          endDate: 1,
          policyCategory: 1,
          policyCarrier: 1,
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
          userId: "$userInfo",
        },
      },
    ]);

    return res.status(200).json(policyData);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllPolicyData = async (req, res) => {
  try {
    const policyData = await PolicyInfoModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          _id: 1,
          policyNumber: 1,
          startDate: 1,
          endDate: 1,
          policyCategory: 1,
          policyCarrier: 1,
          userId: "$userInfo",
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return res.status(200).json(policyData);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
