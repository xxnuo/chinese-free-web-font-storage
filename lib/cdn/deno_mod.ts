function ipv6ToNumber(ipv6: string) {
    // 检查输入是否为有效的IPv6地址格式
    if (!/^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(ipv6)) {
        throw new Error('Invalid IPv6 address');
    }
    // 将IPv6地址分割为8个16位的部分
    const parts = ipv6.split(':').map(part => parseInt(part, 16));
    // 每个16位部分转换为8字节的二进制字符串
    const binaryParts = parts.map(part => part.toString(2).padStart(16, '0'));
    // 拼接所有二进制部分形成完整的128位二进制字符串
    const binaryIp = binaryParts.join('');
    // 将二进制字符串转换为大整数
    return BigInt('0b' + binaryIp);
}


Deno.serve(async function handleRequest(request: Request, connInfo: Deno.ServeHandlerInfo): Promise<Response> {
    const addr = connInfo.remoteAddr;
    const ip = addr.hostname;
    const cdnUrls = [
        "834832894.r.cdn36.com",
    ];
    const url = new URL(request.url);
    const redirectUrl = cdnUrls[(ipv6ToNumber(ip) % BigInt(cdnUrls.length.toString()) as any as number)];
    url.host = redirectUrl;
    const headers = new Headers()
    headers.set("Access-Control-Allow-Headers", "*");
    headers.set("Access-Control-Allow-Methods", "GET");
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Location", url.toString());
    headers.set("Cache-Control", "public, s-maxage=31536000, max-age=31536000, must-revalidate");
    headers.set("x-your-ip", ip);
    console.log(ip)
    const res = new Response(null, {
        headers,
        status: 307
    });

    return res
});
