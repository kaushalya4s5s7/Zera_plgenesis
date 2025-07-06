// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AuditRegistry {
    struct AuditEntry {
        uint8 stars;
        string summary;
        address auditor;
        uint256 timestamp;
    }

    mapping(bytes32 => AuditEntry[]) private contractAudits;
    mapping(address => bytes32[]) private auditorHistory;
    bytes32[] private allContractHashes;
    mapping(bytes32 => bool) private seenHashes;
    
    // New mapping for transaction hash to CID
    mapping(bytes32 => string) private auditReportCIDs;
    // Track which auditor registered which audit (by tx hash)
    mapping(bytes32 => address) private auditRegistrants;

    event AuditRegistered(
        bytes32 indexed contractHash,
        uint8 stars,
        string summary,
        address indexed auditor,
        uint256 timestamp,
        bytes32 indexed txHash
    );
    
    event CIDMapped(
        bytes32 indexed txHash,
        string cid,
        address indexed auditor,
        uint256 timestamp
    );

    function registerAudit(bytes32 contractHash, uint8 stars, string calldata summary) external returns (bytes32) {
        AuditEntry memory newAudit = AuditEntry({
            stars: stars,
            summary: summary,
            auditor: msg.sender,
            timestamp: block.timestamp
        });

        contractAudits[contractHash].push(newAudit);
        auditorHistory[msg.sender].push(contractHash);

        if (!seenHashes[contractHash]) {
            seenHashes[contractHash] = true;
            allContractHashes.push(contractHash);
        }

        // Generate a unique transaction hash for this audit registration
        bytes32 txHash = keccak256(abi.encodePacked(block.timestamp, msg.sender, contractHash, block.number));
        auditRegistrants[txHash] = msg.sender;

        emit AuditRegistered(contractHash, stars, summary, msg.sender, block.timestamp, txHash);
        
        return txHash;
    }

    function getContractAudits(bytes32 contractHash)
        external
        view
        returns (AuditEntry[] memory)
    {
        return contractAudits[contractHash];
    }

    function getAuditorHistory(address auditor)
        external
        view
        returns (bytes32[] memory)
    {
        return auditorHistory[auditor];
    }

    function getLatestAudit(bytes32 contractHash)
        external
        view
        returns (AuditEntry memory)
    {
        AuditEntry[] memory audits = contractAudits[contractHash];
        require(audits.length > 0, "No audits found for contract");
        return audits[audits.length - 1];
    }

    function getAllAudits(uint256 startIndex, uint256 limit)
        external
        view
        returns (
            bytes32[] memory contractHashes,
            uint8[] memory stars,
            string[] memory summaries,
            address[] memory auditors,
            uint256[] memory timestamps
        )
    {
        uint256 total = allContractHashes.length;
        require(startIndex < total, "Invalid start index");

        uint256 end = startIndex + limit;
        if (end > total) end = total;
        uint256 resultCount = end - startIndex;

        contractHashes = new bytes32[](resultCount);
        stars = new uint8[](resultCount);
        summaries = new string[](resultCount);
        auditors = new address[](resultCount);
        timestamps = new uint256[](resultCount);

        for (uint256 i = 0; i < resultCount; i++) {
            bytes32 hash = allContractHashes[startIndex + i];
            AuditEntry memory audit = contractAudits[hash][contractAudits[hash].length - 1];
            contractHashes[i] = hash;
            stars[i] = audit.stars;
            summaries[i] = audit.summary;
            auditors[i] = audit.auditor;
            timestamps[i] = audit.timestamp;
        }
    }

    function getTotalContracts() external view returns (uint256) {
        return allContractHashes.length;
    }
    
    function getContractHashByIndex(uint256 index) external view returns (bytes32) {
        require(index < allContractHashes.length, "Index out of bounds");
        return allContractHashes[index];
    }

    /**
     * @dev Maps a CID to a transaction hash. Only callable by the original auditor.
     * @param txHash The transaction hash from audit registration
     * @param cid The Filecoin CID of the audit report
     */
    function mapCIDToAudit(bytes32 txHash, string calldata cid) external {
        require(auditRegistrants[txHash] == msg.sender, "Only the original auditor can map CID");
        require(bytes(auditReportCIDs[txHash]).length == 0, "CID already mapped for this audit");
        require(bytes(cid).length > 0, "CID cannot be empty");

        auditReportCIDs[txHash] = cid;
        
        emit CIDMapped(txHash, cid, msg.sender, block.timestamp);
    }

    /**
     * @dev Retrieves the CID for a given transaction hash
     * @param txHash The transaction hash from audit registration
     * @return The Filecoin CID of the audit report, or empty string if not mapped
     */
    function getAuditCID(bytes32 txHash) external view returns (string memory) {
        return auditReportCIDs[txHash];
    }

    /**
     * @dev Checks if a CID has been mapped for a given transaction hash
     * @param txHash The transaction hash from audit registration
     * @return True if CID is mapped, false otherwise
     */
    function isCIDMapped(bytes32 txHash) external view returns (bool) {
        return bytes(auditReportCIDs[txHash]).length > 0;
    }
}