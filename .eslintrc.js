// @see: http://eslint.cn
const isDev = process.env.NODE_ENV === 'development';
module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true
	},
	/* 指定如何解析语法 */
	parser: 'vue-eslint-parser',
	/* 优先级低于 parse 的语法解析配置 */
	parserOptions: {
		parser: '@typescript-eslint/parser',
		ecmaVersion: 2020,
		sourceType: 'module',
		jsxPragma: 'React',
		ecmaFeatures: {
			jsx: true
		}
	},
	/* 继承某些已有的规则 */
	extends: [
		'plugin:vue/vue3-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'plugin:prettier/recommended',
		'./.eslintrc-auto-import.json'
	],
	/*
	 * "off" 或 0    ==>  关闭规则
	 * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
	 * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
	 */
	rules: {
		// eslint (http://eslint.cn/docs/rules)
		'no-var': 'error', // 要求使用 let 或 const 而不是 var
		'no-multiple-empty-lines': ['error', { max: 1 }], // 不允许多个空行
		'no-use-before-define': 'off', // 禁止在 函数/类/变量 定义之前使用它们
		'no-irregular-whitespace': 'off', // 禁止不规则的空白
		camelcase: ['error', { properties: 'never' }], // 骆峰法命名
		'prefer-const': 2, // 使用 const 声明那些声明后不再被修改的变量
		'no-const-assign': 2, // 禁止修改 const 声明的变量
		quotes: ['error', 'single'], // 强制使用单引号
		'no-undefined': 0, // 禁止将 undefined 作为标识符
		'object-shorthand': 2, // 禁止对象字面量中方法和属性使用简写语法
		'quote-props': ['error', 'as-needed'], // 当没有严格要求时，禁止对象字面量属性名称使用引号
		'dot-notation': 2, // 强制尽可能地使用点号
		'space-before-blocks': 2, // 强制在块之前使用一致的空格
		'no-nested-ternary': 2, // 禁用嵌套的三元表达式
		'no-unneeded-ternary': 2, // 禁止可以在有更简单的可替代的表达式时使用三元操作符
		'brace-style': 2, // 强制在代码块中使用一致的大括号风格
		'comma-spacing': ['error', { before: false, after: true }], // 强制在逗号前无空格，逗号后有空格
		'comma-style': ['error', 'last'], // 要求逗号放在数组元素、对象属性或变量声明之后，且在同一行
		'prefer-destructuring': 0, // 优先使用数组和对象解构
		'no-duplicate-imports': 0, // 禁止重复模块导入
		'prefer-arrow-callback': 2, // 要求回调函数使用箭头函数
		'no-confusing-arrow': 2, // 禁止在可能与比较操作符相混淆的地方使用箭头函数
		eqeqeq: 2, // 使用全等
		'no-extra-semi': 2, // 禁止不必要的分号
		semi: 2, // 要求在语句末尾使用分号
		'semi-spacing': ['error', { before: false, after: true }], // 强制分号之前和之后使用一致的空格
		'array-bracket-spacing': ['error', 'never'], // 禁止在数组括号内出现空格
		'key-spacing': ['error', { beforeColon: false }], // 强制在对象字面量的属性中键和值之间使用一致的间距
		'keyword-spacing': ['error', { before: true }], // 禁止在对象字面量的键和冒号之间存在空格
		'no-lonely-if': 2, // 禁止 if 作为唯一的语句出现在 else 语句中
		'no-whitespace-before-property': 2, // 禁止属性前有空白
		'arrow-spacing': 2, // 强制箭头函数的箭头前后使用一致的空格 默认配置为 { "before": true, "after": true }
		'space-infix-ops': 2, // 要求操作符周围有空格
		'no-mixed-spaces-and-tabs': 0, // 禁止空格和 tab 的混合缩进
		'no-undef': 0, // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
		'no-debugger': isDev ? 0 : 2, // 生产模式禁止使用debugger
		'no-unreachable': 2, // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码
		'no-eval': 0,
		// typeScript (https://typescript-eslint.io/rules)
		'@typescript-eslint/no-unused-vars': 'error', // 禁止定义未使用的变量
		'@typescript-eslint/no-inferrable-types': 'off', // 可以轻松推断的显式类型可能会增加不必要的冗长
		'@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间。
		'@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 类型
		'@typescript-eslint/ban-ts-ignore': 'off', // 禁止使用 @ts-ignore
		'@typescript-eslint/ban-types': 'off', // 禁止使用特定类型
		'@typescript-eslint/explicit-function-return-type': 'off', // 不允许对初始化为数字、字符串或布尔值的变量或参数进行显式类型声明
		'@typescript-eslint/no-var-requires': 'off', // 不允许在 import 语句中使用 require 语句
		'@typescript-eslint/no-empty-function': 'off', // 禁止空函数
		'@typescript-eslint/no-use-before-define': 'off', // 禁止在变量定义之前使用它们
		'@typescript-eslint/ban-ts-comment': 'off', // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
		'@typescript-eslint/no-non-null-assertion': 'off', // 不允许使用后缀运算符的非空断言(!)
		'@typescript-eslint/explicit-module-boundary-types': 'off', // 要求导出函数和类的公共类方法的显式返回和参数类型

		// vue (https://eslint.vuejs.org/rules)
		'vue/no-v-html': 'off', // 禁止使用 v-html
		'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用，此规则仅在启用该no-unused-vars规则时有效。
		'vue/v-slot-style': 'error', // 强制执行 v-slot 指令样式
		'vue/no-mutating-props': 'off', // 不允许组件 prop的改变
		'vue/custom-event-name-casing': 'off', // 为自定义事件名称强制使用特定大小写
		'vue/attributes-order': 'off', // vue api使用顺序，强制执行属性顺序
		'vue/one-component-per-file': 'off', // 强制每个组件都应该在自己的文件中
		'vue/html-closing-bracket-newline': 'off', // 在标签的右括号之前要求或禁止换行
		'vue/max-attributes-per-line': 'off', // 强制每行的最大属性数
		'vue/multiline-html-element-content-newline': 'off', // 在多行元素的内容之前和之后需要换行符
		'vue/singleline-html-element-content-newline': 'off', // 在单行元素的内容之前和之后需要换行符
		'vue/attribute-hyphenation': 'off', // 对模板中的自定义组件强制执行属性命名样式
		'vue/require-default-prop': 'off', // 此规则要求为每个 prop 为必填时，必须提供默认值
		'vue/multi-word-component-names': 'off' // 要求组件名称始终为 “-” 链接的单词
	}
};
