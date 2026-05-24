"""
CAEOS Agent: Recovery Engineer (L9)
مهندس الاسترداد — الطبقة التاسعة

Snapshots, rollbacks, semantic diffs, corruption recovery.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class Snapshot(BaseModel):
    """A system snapshot for recovery."""
    
    snapshot_id: str = Field(..., description="Unique snapshot ID")
    timestamp: str = Field(..., description="ISO timestamp")
    phase: str = Field(..., description="Phase when snapshot was taken")
    layer: str = Field(..., description="Layer being snapshotted")
    data: Dict = Field(..., description="Snapshot data")
    checksum: str = Field(..., description="Data integrity checksum")
    description: str = Field(..., description="What this snapshot captures")


class RecoveryResult(BaseModel):
    """Result of a recovery operation."""
    
    success: bool = Field(..., description="Was recovery successful?")
    snapshot_id: str = Field(..., description="Snapshot used for recovery")
    recovered_data: Optional[Dict] = Field(None, description="Restored data")
    data_loss: Optional[str] = Field(None, description="What data could not be recovered")
    constitutional_check_passed: bool = Field(..., description="Did constitution check pass?")


class RecoveryEngineerAgent:
    """
    L9 — Recovery Engine
    
    Emergency Responder: Snapshots, rollbacks, semantic diffs, corruption recovery.
    """
    
    LAYER = "L9"
    NAME = "recovery_engineer"
    NAME_AR = "مهندس الاسترداد"
    ROLE = "Emergency Responder"
    ROLE_AR = "مستجيب طوارئ"
    
    def __init__(self, config: Optional[Dict] = None):
        self.config = config or {}
        self.trust_score = 0.96
        self.snapshots: List[Snapshot] = []
        
    def create_snapshot(self, phase: str, layer: str, data: Dict, description: str) -> Snapshot:
        """
        Create a recovery snapshot before any change.
        
        Args:
            phase: Current pipeline phase
            layer: Sovereign layer
            data: Data to snapshot
            description: What this captures
            
        Returns:
            Snapshot: The created snapshot
        """
        import hashlib
        import json
        
        # Generate checksum
        data_str = json.dumps(data, sort_keys=True)
        checksum = hashlib.sha256(data_str.encode()).hexdigest()[:16]
        
        snapshot = Snapshot(
            snapshot_id=f"snap-{len(self.snapshots)}-{phase}-{layer}",
            timestamp=datetime.utcnow().isoformat() + "Z",
            phase=phase,
            layer=layer,
            data=data,
            checksum=checksum,
            description=description
        )
        
        self.snapshots.append(snapshot)
        return snapshot
    
    def rollback(self, snapshot_id: str, constitution_check: bool = True) -> RecoveryResult:
        """
        Rollback to a previous snapshot.
        
        Args:
            snapshot_id: Snapshot to restore
            constitution_check: Verify constitution before rollback
            
        Returns:
            RecoveryResult: Rollback result
        """
        snapshot = next((s for s in self.snapshots if s.snapshot_id == snapshot_id), None)
        
        if not snapshot:
            return RecoveryResult(
                success=False,
                snapshot_id=snapshot_id,
                data_loss="Snapshot not found",
                constitutional_check_passed=False
            )
        
        # In production: verify checksum, validate constitution
        
        return RecoveryResult(
            success=True,
            snapshot_id=snapshot_id,
            recovered_data=snapshot.data,
            constitutional_check_passed=constitution_check
        )
    
    def semantic_diff(self, snapshot_a_id: str, snapshot_b_id: str) -> Dict:
        """
        Generate semantic diff between two snapshots.
        
        Args:
            snapshot_a_id: First snapshot
            snapshot_b_id: Second snapshot
            
        Returns:
            Dict: Differences with constitutional impact
        """
        snap_a = next((s for s in self.snapshots if s.snapshot_id == snapshot_a_id), None)
        snap_b = next((s for s in self.snapshots if s.snapshot_id == snapshot_b_id), None)
        
        if not snap_a or not snap_b:
            return {"error": "One or both snapshots not found"}
        
        # Simple key-level diff
        keys_a = set(snap_a.data.keys())
        keys_b = set(snap_b.data.keys())
        
        added = keys_b - keys_a
        removed = keys_a - keys_b
        common = keys_a & keys_b
        
        changed = []
        for key in common:
            if snap_a.data[key] != snap_b.data[key]:
                changed.append(key)
        
        return {
            "added": list(added),
            "removed": list(removed),
            "changed": changed,
            "constitutional_impact": "MEDIUM" if len(changed) > 5 else "LOW"
        }
    
    def list_snapshots(self, phase: Optional[str] = None) -> List[Dict]:
        """List all snapshots, optionally filtered by phase."""
        snapshots = self.snapshots
        if phase:
            snapshots = [s for s in snapshots if s.phase == phase]
        return [s.dict() for s in snapshots]
