export const generateSingleExecutionCode = (
	userCode: string,
	functionName: string,
	input: string,
	languageId: string
): string => {
	const formatInput = (raw: string): string => {
		try {
			const parsed = JSON.parse(`[${raw}]`);
			return parsed
				.map((val: any) =>
					typeof val === "string" ? `"${val}"` : JSON.stringify(val)
				)
				.join(", ");
		} catch {
			return raw;
		}
	};

	const args = formatInput(input);

	switch (languageId) {
		case "63": // JavaScript
			return `${userCode}\nconsole.log(${functionName}(${args}));`;

		case "71": // Python
			return `${userCode}\nprint(${functionName}(${args}))`;

		case "72": // Ruby
			return `${userCode}\nputs ${functionName}(${args})`;

		case "50": // C
			return `
#include <stdio.h>

${userCode}

int main() {
  printf("%d\\n", ${functionName}(${args}));
  return 0;
}
`.trim();

		case "52": // C++
			return `
#include <iostream>
using namespace std;

${userCode}

int main() {
  cout << ${functionName}(${args}) << endl;
  return 0;
}
`.trim();

		case "62": // Java
			return `
public class Main {
${userCode}

public static void main(String[] args) {
  System.out.println(${functionName}(${args}));
}
}
`.trim();

		case "73": // Rust
			return `
${userCode}

fn main() {
  println!("{}", ${functionName}(${args}));
}
`.trim();

		default:
			return `${userCode} // Unknown language`;
	}
};
