// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract PaymentReceiver {
    event PaymentReceived(address indexed merchant, address indexed payer, address token, uint256 amount);

    function pay(address merchant, address token, uint256 amount) external {
        // Only for ERC20 tokens
        require(token != address(0), "Native token not supported here");
        require(IERC20(token).transferFrom(msg.sender, merchant, amount), "ERC20 transfer failed");

        emit PaymentReceived(merchant, msg.sender, token, amount);
    }
}
