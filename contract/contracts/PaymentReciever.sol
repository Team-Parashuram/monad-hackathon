// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract PaymentReceiver {
    event PaymentReceived(address indexed merchant, address indexed payer, address token, uint256 amount);

    function pay(address merchant, address token, uint256 amount) external payable {
        if (token == address(0)) {
            // Native token (ETH/Monad)
            require(msg.value == amount, "Incorrect value sent");
            payable(merchant).transfer(amount);
        } else {
            // ERC20 token
            require(IERC20(token).transferFrom(msg.sender, merchant, amount), "ERC20 transfer failed");
        }

        emit PaymentReceived(merchant, msg.sender, token, amount);
    }
}
