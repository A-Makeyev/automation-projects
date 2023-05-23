CREATE table Vessel (
	ID int,
	VesselName varchar(50),
	IMOCode int,
	Voyage int,
	Direction char(1),
	EUPort varchar(50),
	CurrentETA date
)

INSERT INTO Vessel (ID, VesselName, IMOCode, Voyage, Direction, EUPort, CurrentETA)
	VALUES (1, 'E.R. Kobe (UZL)', 9222974, 15, 'W', 'Valencia', '2020-06-24T12:00:00')

INSERT INTO Vessel (ID, VesselName, IMOCode, Voyage, Direction, EUPort, CurrentETA)
	VALUES (2, 'Msc Geneva (VKH)', 9320427, 47, 'W', 'Valencia', '2020-06-17T12:00:00')

INSERT INTO Vessel (ID, VesselName, IMOCode, Voyage, Direction, EUPort, CurrentETA)
	VALUES (3, 'Dimitris Y (IJR)', 9189354, 51, 'W', 'Valencia', '2020-06-10T12:00:00')

INSERT INTO Vessel (ID, VesselName, IMOCode, Voyage, Direction, EUPort, CurrentETA)
	VALUES (4, 'Msc Lausanne (YLU)', 9320398, 32, 'W', 'Valencia', '2020-06-03T12:00:00')

INSERT INTO Vessel (ID, VesselName, IMOCode, Voyage, Direction, EUPort, CurrentETA)
	VALUES (5, 'Oakland Express (EOW)', 9200811, 46, 'E', 'Valencia', '2020-05-29T12:00:00')

INSERT INTO Vessel (ID, VesselName, IMOCode, Voyage, Direction, EUPort, CurrentETA)
	VALUES (6, 'Rio Blackwater (IU8)', 9216987, 21, 'E', 'Algeciras', '2020-05-28T12:00:00')

INSERT INTO Vessel (ID, VesselName, IMOCode, Voyage, Direction, EUPort, CurrentETA)
	VALUES (7, 'Msc Jeongmin (JM2)', 9720471, 4, 'N', 'Valencia', '2020-05-27T12:00:00')

INSERT INTO Vessel (ID, VesselName, IMOCode, Voyage, Direction, EUPort, CurrentETA)
	VALUES (8, 'Msc Carouge (QGU)', 9320441, 36, 'W', 'Valencia', '2020-05-27T12:00:00')

INSERT INTO Vessel (ID, VesselName, IMOCode, Voyage, Direction, EUPort, CurrentETA)
	VALUES (9, 'Vienna Express (VXM)', 9450416, 67, 'W', 'Algeciras', '2020-05-22T12:00:00')

INSERT INTO Vessel (ID, VesselName, IMOCode, Voyage, Direction, EUPort, CurrentETA)
	VALUES (10, 'Singapore Express (GXB)', 9200809, 16, 'E', 'Valencia', '2020-05-22T12:00:00')


UPDATE Vessel 
SET VesselName = 'Msc Jeongmin (JM2)',
IMOCode = 9720471,
Voyage = 4,
Direction = 'N',
EUPort = 'Valencia',
CurrentETA = '2020-05-27T12:00:00'
WHERE ID = 10


SELECT * FROM Vessel

