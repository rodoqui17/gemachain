// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MineralTraceability {
    
    // Estructura para almacenar información sobre los minerales
    struct Mineral {
        string name;
        uint256 weight;   // Peso en gramos
        string quality;   // Calidad del mineral
        string origin;    // País de origen
        address currentOwner;  // Dirección del propietario actual
        address operator;      // Operador de mina
        address transporter;   // Transportista
        address processor;     // Procesador
        address buyer;         // Comprador
    }
    
    // Lista de minerales registrados
    Mineral[] public minerals;

    // Roles de los actores
    address public regulator;
    mapping(address => bool) public auditors;
    mapping(address => bool) public mineOperators;
    mapping(address => bool) public transporters;
    mapping(address => bool) public processors;
    mapping(address => bool) public buyers;

    // Mapeo para rastrear el historial de propietarios por mineral
    mapping(uint256 => address[]) public mineralOwners;

    // Eventos para notificar diferentes acciones
    event MineralRegistered(uint256 mineralId, string name, string origin);
    event TransferOwnership(uint256 mineralId, address indexed from, address indexed to);
    event TransportAssigned(uint256 mineralId, address transporter);
    event ProcessingAssigned(uint256 mineralId, address processor);
    event PurchaseCompleted(uint256 mineralId, address buyer);
    event AuditPerformed(uint256 mineralId, address auditor);

    // Constructor para establecer el regulador (quien despliega el contrato)
    constructor() {
        regulator = msg.sender;
    }

    // Modificadores de permisos
    modifier onlyRegulator() {
        require(msg.sender == regulator, "Solo el regulador puede realizar esta accion");
        _;
    }

    modifier onlyAuditor() {
        require(auditors[msg.sender], "Solo un auditor puede realizar esta accion");
        _;
    }

    modifier onlyMineOperator() {
        require(mineOperators[msg.sender], "Solo un operador de mina puede realizar esta accion");
        _;
    }

    modifier onlyTransporter() {
        require(transporters[msg.sender], "Solo un transportista puede realizar esta accion");
        _;
    }

    modifier onlyProcessor() {
        require(processors[msg.sender], "Solo un procesador puede realizar esta accion");
        _;
    }

    modifier onlyBuyer() {
        require(buyers[msg.sender], "Solo un comprador puede realizar esta accion");
        _;
    }

    // Funciones para que el regulador asigne roles
    function addAuditor(address _auditor) public onlyRegulator {
        auditors[_auditor] = true;
    }

    function addMineOperator(address _operator) public onlyRegulator {
        mineOperators[_operator] = true;
    }

    function addTransporter(address _transporter) public onlyRegulator {
        transporters[_transporter] = true;
    }

    function addProcessor(address _processor) public onlyRegulator {
        processors[_processor] = true;
    }

    function addBuyer(address _buyer) public onlyRegulator {
        buyers[_buyer] = true;
    }

    // Función para registrar un nuevo mineral por un operador de mina
    function registerMineral(string memory _name, uint256 _weight, string memory _quality, string memory _origin) public onlyMineOperator {
        Mineral memory newMineral = Mineral({
            name: _name,
            weight: _weight,
            quality: _quality,
            origin: _origin,
            currentOwner: msg.sender,
            operator: msg.sender,
            transporter: address(0),
            processor: address(0),
            buyer: address(0)
        });
        
        minerals.push(newMineral);
        uint256 mineralId = minerals.length - 1;
        mineralOwners[mineralId].push(msg.sender);

        emit MineralRegistered(mineralId, _name, _origin);
    }

    // Función para asignar un transportista a un mineral
    function assignTransporter(uint256 _mineralId, address _transporter) public onlyMineOperator {
        require(_mineralId < minerals.length, "Mineral no encontrado");
        require(transporters[_transporter], "El transportista no tiene permisos");

        minerals[_mineralId].transporter = _transporter;

        emit TransportAssigned(_mineralId, _transporter);
    }

    // Función para asignar un procesador a un mineral
    function assignProcessor(uint256 _mineralId, address _processor) public onlyTransporter {
        require(_mineralId < minerals.length, "Mineral no encontrado");
        require(processors[_processor], "El procesador no tiene permisos");

        minerals[_mineralId].processor = _processor;

        emit ProcessingAssigned(_mineralId, _processor);
    }

    // Función para transferir la propiedad de un mineral a un comprador
    function completePurchase(uint256 _mineralId, address _buyer) public onlyProcessor {
        require(_mineralId < minerals.length, "Mineral no encontrado");
        require(buyers[_buyer], "El comprador no tiene permisos");

        minerals[_mineralId].currentOwner = _buyer;
        minerals[_mineralId].buyer = _buyer;
        mineralOwners[_mineralId].push(_buyer);

        emit PurchaseCompleted(_mineralId, _buyer);
    }

    // Función para auditar un mineral
    function auditMineral(uint256 _mineralId) public onlyAuditor {
        require(_mineralId < minerals.length, "Mineral no encontrado");

        emit AuditPerformed(_mineralId, msg.sender);
    }

    // Obtener información de un mineral específico
    function getMineral(uint256 _mineralId) public view returns (string memory, uint256, string memory, string memory, address, address, address, address) {
        require(_mineralId < minerals.length, "Mineral no encontrado");
        Mineral memory mineral = minerals[_mineralId];
        return (mineral.name, mineral.weight, mineral.quality, mineral.origin, mineral.operator, mineral.transporter, mineral.processor, mineral.buyer);
    }

    // Obtener el historial de propietarios de un mineral
    function getOwnershipHistory(uint256 _mineralId) public view returns (address[] memory) {
        require(_mineralId < minerals.length, "Mineral no encontrado");
        return mineralOwners[_mineralId];
    }
}
