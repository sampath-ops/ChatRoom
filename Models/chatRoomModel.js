const mongoose = require("mongoose")
const { v4: uuidv4 } = require('uuid');
const chatRoomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    userIds: Array,
    chatInitiator: String,
    roomName:String
  },
  {
    timestamps: true,
    collection: "chatrooms",
  }
);

chatRoomSchema.statics.initiateChat = async function (
	userIds, chatInitiator,roomName
) {
  try {
    const availableRoom = await this.findOne({
      userIds: {
        $size: userIds.length,
        $all: [...userIds],
      },
    });
    if (availableRoom) {
      return {
        isNew: false,
        message: 'retrieving an old chat room',
        chatRoomId: availableRoom._doc._id,
        roomName: availableRoom._doc.roomName
      };
    }

    const newRoom = await this.create({ userIds, chatInitiator,roomName });
    return {
      isNew: true,
      message: 'creating a new chatroom',
      chatRoomId: newRoom._doc._id,
      roomName: newRoom._doc.roomName
    };
  } catch (error) {
    console.log('error on start chat method', error);
    throw error;
  }
}

chatRoomSchema.statics.getChatRoomsByUserId = async function (userId) {
  try {
    const rooms = await this.find({ userIds: { $all: [userId] } });
    return rooms;
  } catch (error) {
    throw error;
  }
}

chatRoomSchema.statics.getChatRoomByRoomId = async function (roomId) {
  try {
    const room = await this.findOne({ _id: roomId });
    return room;
  } catch (error) {
    throw error;
  }
}

module.exports = mongoose.model("ChatRoom", chatRoomSchema);