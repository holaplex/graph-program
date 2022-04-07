use anchor_lang::{prelude::*};

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ConnectionStatus {
    Connected = 1,
    Disconnected = 2,
}

#[account]
#[derive(Default)]
pub struct Connection {
    pub from: Pubkey,
    pub to: Pubkey,
    // V2 Items.
    pub connected_at: Option<i64>, // No connected_at time equals connected
    pub disconnected_at: Option<i64>, // No disconnected_at time equals connected
}

impl Connection {
    pub fn calculate_space() -> usize {
        8 +         // account discriminator
        32 +        // from
        32 +        // to
        1 + 8 +     // connected_at
        1 + 8       // disconnected_at
    }
    pub fn log_make(&self) {
        msg!("Connected from {} to {}", self.from, self.to);
    }
    pub fn log_revoke(&self) {
        msg!("Disconnected from {} to {}", self.from, self.to);
    }
    pub fn log_close(&self) {
        msg!("Closed from {} to {}", self.from, self.to);
    }
}
