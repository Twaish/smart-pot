using Domain.Model;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace YourApiNamespace.Controllers;

public class Pot
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string NameOfPot { get; set; }
    public string Email { get; set; }
    public bool Enable { get; set; }
    public string MachineID { get; set; }
    public string PlantId { get; set; }

    public Pot() {}

    public Pot(string nameOfPot, string email, bool enable, string machineId, string plantId)
    {
        NameOfPot = nameOfPot;
        Email = email;
        Enable = enable;
        MachineID = machineId;
        PlantId = plantId;
    }
}