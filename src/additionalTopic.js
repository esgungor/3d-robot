export const blasterTrigger = (ros, data) => {
  let topic = new ROSLIB.Topic({
    ros: ros,
    name: "/robomaster/blaster",
    messageType: "std_msgs/String",
  });
  topic.publish(data);
};
