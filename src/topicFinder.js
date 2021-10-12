//only for testing purposes

export const getTopics = () => {
  var topicsClient = new ROSLIB.Service({
    ros: ros,
    name: "/rosapi/topics",
    serviceType: "rosapi/Topics",
  });

  var request = new ROSLIB.ServiceRequest();

  topicsClient.callService(request, function (result) {
    console.log("Getting topics...");
    console.log(result.topics);
  });
};
